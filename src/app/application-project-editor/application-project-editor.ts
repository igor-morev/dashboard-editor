import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { EditorCommand, Layer, Widget } from './types/application-editor.type';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenuOverlay } from '@app/shared/context-menu-overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditorContextMenu } from './ui/context-menu/context-menu';
import { ApplicationEditorState } from './state/application-editor-state';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LayerPropertyBuilder } from './components/layer-property-builder/layer-property-builder';
import { WidgetsState } from './state/widgets-state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Autofocus } from './ui/directives/autofocus';
import { LayersEditor } from './services/layers-editor';

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
    Autofocus,
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

  private layersEditor = inject(LayersEditor);

  editingLayerId = signal<string | null>(null);

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

  getParent(parentId: string, reccursive = false): Layer | null {
    const parent = this.appState.appViewSchema.layersMap[parentId];

    if (!parent) {
      return null;
    }

    if (reccursive && parent.parentId) {
      return this.getParent(parent.parentId, true);
    }

    return parent;
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

  highlightLayerFromTree(event: Event, layer: Layer) {
    this.highlightLayer(layer);
  }

  unhighlightLayerFromTree(event: Event) {
    this.unhighlightLayer();
  }

  clickOnLayerFromScaffold(event: MouseEvent) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (id) {
      this.selectLayer(this.appState.appViewSchema.layersMap[id]);
    }
  }

  clickOnLayerFromTree(event: MouseEvent) {
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
      this.selectedLayer,
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

  toggleLayerVisibility($event: Event, selectedLayer: Layer) {
    const updatedLayer = {
      ...selectedLayer,
      isVisible: !selectedLayer.isVisible,
    };

    const updatedLayersTree = this.layersEditor.updateLayerInTree(
      this.appState.appViewSchema.layers,
      selectedLayer.id,
      updatedLayer,
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayersTree,
        layersMap: this.layersEditor.updateLayersMap(updatedLayersTree, {}),
      },
    });
  }

  toggleLayerLock($event: Event, selectedLayer: Layer) {
    const updatedLayer = {
      ...selectedLayer,
      locked: !selectedLayer.locked,
    };

    const updatedLayersTree = this.layersEditor.updateLayerInTree(
      this.appState.appViewSchema.layers,
      selectedLayer.id,
      updatedLayer,
    );

    const updatedLayersMap = this.layersEditor.updateLayersMap(updatedLayersTree, {});

    this.state.updateAppState({
      selectedLayer: updatedLayersMap[selectedLayer.id],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayersTree,
        layersMap: updatedLayersMap,
      },
    });
  }

  startEditingLayer(layerId: string): void {
    this.editingLayerId.set(layerId);
  }

  saveLayerName(layer: Layer, newName: string): void {
    if (newName.trim()) {
      const updatedLayer: Layer = {
        ...layer,
        layerName: newName,
      };

      const updatedLayersTree = this.layersEditor.updateLayerInTree(
        this.appState.appViewSchema.layers,
        layer.id,
        updatedLayer,
      );

      const updatedLayersMap = this.layersEditor.updateLayersMap(updatedLayersTree, {});

      this.state.updateAppState({
        selectedLayer: updatedLayersMap[layer.id],
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: updatedLayersTree,
          layersMap: updatedLayersMap,
        },
      });
    }
    this.editingLayerId.set(null);
  }

  cancelEditingLayer(): void {
    this.editingLayerId.set(null);
  }

  private createLayer(widget: Widget) {
    if (
      this.selectedLayer &&
      this.selectedLayer.widgetReference.canNotBeAddedInside &&
      this.selectedLayer.widgetReference.canNotBeAddedInside(widget)
    ) {
      return;
    }

    const newLayer = this.layersEditor.createLayerForWidget(
      widget,
      this.selectedLayer.id,
      this.selectedLayer.children.length,
    );
    const updatedLayers = this.layersEditor.insertLayerInSchema(
      this.appState.appViewSchema.layers,
      this.selectedLayer.id,
      newLayer,
    );
    const updatedMap = this.layersEditor.updateLayersMap(updatedLayers, {});

    this.state.updateAppState({
      selectedLayer: updatedMap[newLayer.parentId!],
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });
  }

  private duplicateLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    if (!this.selectedLayer.parentId) {
      return;
    }

    const newLayer = this.layersEditor.duplicateLayerTree(this.selectedLayer);

    const updatedLayers = this.layersEditor.recalculateLayersIndex(
      this.layersEditor.insertLayerInSchema(
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
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });
  }

  private removeLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    if (!this.selectedLayer.parentId) {
      return;
    }

    const updatedLayers = this.layersEditor.recalculateLayersIndex(
      this.layersEditor.removeLayerInSchema(
        this.appState.appViewSchema.layers,
        this.selectedLayer.id,
      ),
    );

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: updatedLayers,
        layersMap: this.layersEditor.updateLayersMap(updatedLayers, {}),
      },
    });

    this.selectParentLayer();
  }

  private selectParentLayer() {
    if (this.appState.selectedLayer.parentId) {
      this.selectLayer(this.appState.appViewSchema.layersMap[this.appState.selectedLayer.parentId]);
    }
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
