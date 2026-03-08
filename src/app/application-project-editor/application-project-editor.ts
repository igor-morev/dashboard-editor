import {
  ChangeDetectionStrategy,
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
  ],
  templateUrl: './application-project-editor.html',
  styleUrl: './application-project-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationProjectEditor {
  private destroyRef = inject(DestroyRef);
  private contextMenuOverlay = inject(ContextMenuOverlay);
  private readonly state = inject(ApplicationEditorState);

  get appState() {
    return this.state.appState;
  }

  get selectedLayer() {
    return this.state.appState.selectedLayer;
  }

  get highlightedLayer() {
    return this.state.appState.highlightedLayer;
  }

  get layers() {
    return this.state.appState.appViewSchema.layers;
  }

  get widgets() {
    return this.state.widgets;
  }

  get pages() {
    return this.state.pages;
  }

  moveWidgetOnScaffold(event: Event, widget: Widget) {
    event.preventDefault();
    this.createLayer(widget);
  }

  private createLayer(widget: Widget) {
    console.log('Creating layer for widget', widget);
    if (
      this.selectedLayer &&
      this.selectedLayer.widgetReference.canNotBeAddedInside &&
      this.selectedLayer.widgetReference.canNotBeAddedInside(widget)
    ) {
      return;
    }

    const newLayer: Layer = {
      id: generateUniqueId(),
      parentId: this.selectedLayer.id || null,
      sourceWidgetId: widget.id,
      widgetReference: widget,
      layerPropertyModel: { ...widget.defaultWidgetPropertyModel },
      children: [],
    };

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layersMap: {
          ...this.appState.appViewSchema.layersMap,
          [newLayer.id]: newLayer,
        },
        layers: this.insertLayerInSchema(
          this.appState.appViewSchema.layers,
          this.selectedLayer.id,
          newLayer,
        ),
      },
    });

    // this.selectLayer(newLayer);
  }

  private convertBgPropertyToTailwindClass(propertyKey: string, propertyValue: string): string {
    return `${propertyKey}-${propertyValue}`;
  }

  private insertLayerInSchema(layers: Layer[], destinationId: string, newLayer: Layer): Layer[] {
    return layers.map((layer) => {
      if (layer.id === destinationId) {
        return {
          ...layer,
          children: [...layer.children, newLayer],
        };
      } else if (layer.children.length > 0) {
        return {
          ...layer,
          children: this.insertLayerInSchema(layer.children, destinationId, newLayer),
        };
      } else {
        return layer;
      }
    });
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
    event.stopPropagation();

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

  mouseLeaveOnLayerFromScaffold(event: MouseEvent) {
    event.stopPropagation();

    this.unhighlightLayer();
  }

  contextMenuOnLayerFromScaffold(event: MouseEvent) {
    const id = (event!.target! as HTMLElement)
      .closest('[data-layer-id]')
      ?.getAttribute('data-layer-id');

    if (!id) {
      return;
    }

    this.selectLayer(this.appState.appViewSchema.layersMap[id]);

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
      });
  }

  private removeLayer() {
    if (!this.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    }

    this.state.updateAppState({
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: this.removeLayerInSchema(this.appState.appViewSchema.layers, this.selectedLayer.id),
        layersMap: Object.keys(this.appState.appViewSchema.layersMap).reduce((result, key) => {
          if (key !== this.selectedLayer.id) {
            return {
              ...result,
              [key]: this.appState.appViewSchema.layersMap[key],
            };
          } else {
            return result;
          }
        }, {}),
      },
    });

    this.selectParentLayer();

    console.log('app state after delete', this.appState);
  }

  private selectParentLayer() {
    if (this.appState.selectedLayer.parentId) {
      this.selectLayer(this.appState.appViewSchema.layersMap[this.appState.selectedLayer.parentId]);
    }
  }

  private removeLayerInSchema(layers: Layer[], forDeleteId: string): Layer[] {
    return layers.reduce((result: Layer[], layer) => {
      if (layer.id === forDeleteId) {
        return result;
      } else if (layer.children.length > 0) {
        return [
          ...result,
          { ...layer, children: this.removeLayerInSchema(layer.children, forDeleteId) },
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
    if (this.highlightedLayer && this.highlightedLayer.id === layer.id) {
      return;
    }

    this.state.updateAppState({
      highlightedLayer: layer,
    });
  }

  private unhighlightLayer() {
    if (this.highlightedLayer === undefined) {
      return;
    }

    this.state.updateAppState({
      highlightedLayer: undefined,
    });
  }

  // private unselectLayer() {
  //   this.appState.selectedLayer = null;
  // }

  selectPage(page: { id: string; pageName: string }) {
    if (page) {
      this.state.updateAppState({
        selectedPage: page,
      });
    }
  }

  private clickOutside() {
    // this.appState.selectedLayer = null;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedInsideLayer = (event.target as HTMLElement).closest('[data-scaffold]');

    if (!clickedInsideLayer) {
      this.clickOutside();
    }
  }
}
