import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
} from '@angular/core';
import { EditorCommand, Layer, Widget } from './types/application-editor.type';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenuOverlay } from '@app/shared/context-menu-overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditorContextMenu } from './ui/context-menu/context-menu';
import { generateUniqueId } from './utils/editor';
import { ApplicationEditorState } from './state/application-editor-state';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LayerPropertyBuilder } from './components/layer-property-builder/layer-property-builder';
import { WidgetsState } from './state/widgets-state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'de-application-project-editor',
  imports: [
    NgTemplateOutlet,
    FormsModule,
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LayerPropertyBuilder,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './application-project-editor.html',
  styleUrl: './application-project-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationProjectEditor {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private contextMenuOverlay = inject(ContextMenuOverlay);
  private readonly state = inject(ApplicationEditorState);
  private readonly widgetsState = inject(WidgetsState);

  highlightedLayer = this.state.highlightedLayer;

  get appState() {
    return this.state.appState;
  }

  get selectedLayer() {
    return this.state.appState.selectedLayer;
  }

  get layers() {
    return this.state.appState.appViewSchema.layers;
  }

  get widgets() {
    return this.widgetsState.widgets;
  }

  get pages() {
    return this.state.pages;
  }

  canUndo() {
    return this.state.canUndo();
  }

  canRedo() {
    return this.state.canRedo();
  }

  moveWidgetOnScaffold(event: Event, widget: Widget) {
    event.preventDefault();
    this.createLayer(widget);
  }

  selectLayerFromTree(event: Event, layer: Layer) {
    event.stopPropagation();

    this.selectLayer(layer);
  }

  highlightLayerFromTree(event: Event, layer: Layer) {
    event.stopPropagation();

    this.highlightLayer(layer);
  }

  unhighlightLayerFromTree(event: Event) {
    event.stopPropagation();

    this.unhighlightLayer();
  }

  clickOnLayerFromScaffold(event: MouseEvent) {
    // event.stopPropagation();

    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.selectLayer(this.appState.appViewSchema.layersMap[id]);
    }
  }

  mouseMoveOnScaffold(event: Event) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.highlightLayer(this.appState.appViewSchema.layersMap[id]);
    } else {
      this.unhighlightLayer();
    }
  }

  contextMenuOnLayer(event: MouseEvent) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (!id) {
      return;
    }

    this.selectLayer(this.appState.appViewSchema.layersMap[id]);

    if (!this.selectedLayer.parentId) {
      return;
    }

    const overlayRef = this.contextMenuOverlay.open<EditorContextMenu, EditorCommand>(
      event,
      EditorContextMenu,
      {
        id,
      },
    );

    overlayRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result === 'delete') {
          this.removeLayer();
        }

        if (result === 'duplicate') {
          this.duplicateLayer();
        }

        this.cdr.markForCheck();
      });
  }

  mouseMoveOnTree(event: Event) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.highlightLayer(this.appState.appViewSchema.layersMap[id]);
    } else {
      this.unhighlightLayer();
    }
  }

  mouseLeaveOnTree() {
    this.unhighlightLayer();
  }

  selectPage(page: { id: string; pageName: string }) {
    if (page) {
      this.state.updateAppState({
        selectedPage: page,
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const modifier = isMac ? event.metaKey : event.ctrlKey;

    if (modifier && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
    } else if (
      (modifier && event.shiftKey && event.key === 'z') ||
      (modifier && event.key === 'y')
    ) {
      event.preventDefault();
      this.redo();
    }
  }

  undo() {
    console.log('Undo');
    this.state.undo();
  }

  redo() {
    console.log('Redo');
    this.state.redo();
  }

  private createLayer(widget: Widget) {
    if (
      this.selectedLayer &&
      this.selectedLayer.widgetReference.canNotBeAddedInside &&
      this.selectedLayer.widgetReference.canNotBeAddedInside(widget)
    ) {
      return;
    }

    const newLayer = this.createLayerForWidget(
      widget,
      this.selectedLayer.id,
      this.selectedLayer.children.length,
    );
    const updatedLayers = this.insertLayerInSchema(
      this.appState.appViewSchema.layers,
      this.selectedLayer.id,
      newLayer,
    );
    const updatedMap = this.updateLayersMap(updatedLayers, {});

    this.state.updateAppState({
      selectedLayer: updatedMap[newLayer.parentId!],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.updateLayersMap(updatedLayers, {}),
      },
    });
  }

  private updateLayersMap(
    layers: Layer[],
    layersMap: Record<string, Layer>,
  ): Record<string, Layer> {
    layers.forEach((layer) => {
      layersMap[layer.id] = layer;

      if (layer.children.length > 0) {
        this.updateLayersMap(layer.children, layersMap);
      }
    });

    return layersMap;
  }

  private createLayerForWidget(widget: Widget, parentId: string | null, index = 0): Layer {
    const layerId = generateUniqueId();

    const newLayer: Layer = {
      id: layerId,
      parentId,
      index: index,
      sourceWidgetId: widget.id,
      widgetReference: widget,
      layerPropertyModel: { ...widget.defaultWidgetPropertyModel },
      children: widget.children
        ? widget.children.map((childWidget, childIndex) =>
            this.createLayerForWidget(childWidget, layerId, childIndex),
          )
        : [],
    };

    return newLayer;
  }

  private duplicateLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    if (!this.selectedLayer.parentId) {
      return;
    }

    const newLayer = this.duplicateLayerTree(this.selectedLayer);

    console.log('Duplicated layer:', newLayer);

    console.log(this.selectedLayer.parentId);

    const updatedLayers = this.recalculateLayersIndex(
      this.insertLayerInSchema(
        this.appState.appViewSchema.layers,
        this.selectedLayer.parentId,
        newLayer,
        this.selectedLayer.index + 1,
      ),
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.updateLayersMap(updatedLayers, {}),
      },
    });
  }

  private duplicateLayerTree(layer: Layer, parentId = layer.parentId): Layer {
    const layerId = generateUniqueId();

    const newLayer: Layer = {
      ...layer,
      id: layerId,
      parentId,
      layerPropertyModel: structuredClone(layer.layerPropertyModel),
      children: layer.children
        ? layer.children.map((layerChild) => this.duplicateLayerTree(layerChild, layerId))
        : [],
    };

    return newLayer;
  }

  private removeLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    if (!this.selectedLayer.parentId) {
      return;
    }

    const updatedLayers = this.recalculateLayersIndex(
      this.removeLayerInSchema(this.appState.appViewSchema.layers, this.selectedLayer.id),
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.updateLayersMap(updatedLayers, {}),
      },
    });

    this.selectParentLayer();
  }

  recalculateLayersIndex(layers: Layer[]): Layer[] {
    return layers.map((layer, index) => ({
      ...layer,
      index,
      children: this.recalculateLayersIndex(layer.children),
    }));
  }

  private selectParentLayer() {
    if (this.appState.selectedLayer.parentId) {
      this.selectLayer(this.appState.appViewSchema.layersMap[this.appState.selectedLayer.parentId]);
    }
  }

  private insertLayerInSchema(
    layers: Layer[],
    destinationId: string,
    newLayer: Layer,
    insertIndex?: number,
  ): Layer[] {
    return layers.map((layer) => {
      if (layer.id === destinationId) {
        return {
          ...layer,
          children:
            insertIndex !== undefined
              ? [
                  ...layer.children.slice(0, insertIndex),
                  newLayer,
                  ...layer.children.slice(insertIndex),
                ]
              : [...layer.children, newLayer],
        };
      } else if (layer.children.length > 0) {
        return {
          ...layer,
          children: this.insertLayerInSchema(layer.children, destinationId, newLayer, insertIndex),
        };
      } else {
        return layer;
      }
    });
  }

  private removeLayerInSchema(layers: Layer[], forDeleteId: string): Layer[] {
    return layers.reduce((result: Layer[], layer, index: number) => {
      if (layer.id === forDeleteId) {
        return result;
      } else if (layer.children.length > 0) {
        return [
          ...result,
          { ...layer, index, children: this.removeLayerInSchema(layer.children, forDeleteId) },
        ];
      } else {
        return [...result, layer];
      }
    }, []);
  }

  private selectLayer(layer: Layer) {
    if (this.selectedLayer && this.selectedLayer.id === layer.id) {
      return;
    }

    console.log('Selected layer:', layer);

    this.state.updateAppState({
      selectedLayer: layer,
    });
  }

  private highlightLayer(layer: Layer) {
    if (this.highlightedLayer()?.id === layer.id) {
      return;
    }

    this.state.highlightLayer(layer);
  }

  private unhighlightLayer() {
    if (this.highlightedLayer === undefined) {
      return;
    }

    this.state.highlightLayer(null);
  }
}
