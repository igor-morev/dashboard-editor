import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject } from '@angular/core';
import { AppState, Layer, Widget } from './types/app-builder.type';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayerComponent } from './layer/layer';
import { ContextMenuOverlay } from '@app/shared/context-menu-overlay';
import { EditorContextMenu } from './context-menu/context-menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

function generateUniqueId() {
  return 'layer-' + Math.random().toString(36).substr(2, 9);
}

function layer(id: string): Layer {
  return {
    id,
    sourceWidgetId: 'scaffold-widget',
    widgetReference: {
      id: 'scaffold-widget',
      widgetName: 'Scaffold',
      widgetType: 'scaffold',
      renderContent: 'div',
      defaultWidgetProperties: {
        class: '',
      }
    },
    layerProperties: {
      class: '',
    },
    children: []
}
}

@Component({
  selector: 'de-app-builder',
  imports: [NgTemplateOutlet, FormsModule, LayerComponent, NgClass],
  templateUrl: './app-builder.html',
  styleUrl: './app-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBuilder {
  private destroyRef = inject(DestroyRef);

  private contextMenuOverlay = inject(ContextMenuOverlay);
  appState: AppState = {
    pages: [
      {
        id: 'page-1',
        pageName: 'Home Page'
      }
    ],
    selectedPage: {
      id: 'page-1',
      pageName: 'Home Page'
    },
    selectedLayer: layer('scaffold'),
    appViewSchema: {
      device: 'sm',
      layers: [
        layer('scaffold')
      ],
      layersMap: {
        'scaffold': layer('scaffold')
      }
    }
  };

  widgets: Widget[] = [
    {
      id: 'container-widget',
      widgetName: 'Container',
      widgetType: 'container',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'container';
      },
      defaultWidgetProperties: {
        class: 'pl-2 pr-2 bg-blue-300 min-h-48',
      }
    },
    {
      id: 'section-widget',
      widgetName: 'Section',
      widgetType: 'section',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'section';
      },
      defaultWidgetProperties: {
        class: 'min-h-48 bg-gray-300',
      }
    },
    {
      id: 'row-widget',
      widgetName: 'Row',
      widgetType: 'row',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'row' // TBD;
      },
      defaultWidgetProperties: {
        class: 'min-h-48 bg-red-300 flex gap-x-2',
      }
    },
    {
      id: 'column-widget',
      widgetName: 'Column',
      widgetType: 'column',
      renderContent: 'div',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'column' // TBD;
      },
      defaultWidgetProperties: {
        class: 'min-h-48 bg-green-300 grow pl-2 pr-2',
      }
    },
    {
      id: 'text-widget',
      widgetName: 'Text',
      widgetType: 'text',
      renderContent: 'Some text',
      canNotBeAddedInside: (widget: Widget) => {
        return widget.widgetType === 'text' || widget.widgetType === 'container' || widget.widgetType === 'section';
      },
      defaultWidgetProperties: {
        class: '',
      }
    },
    {
      id: 'image-widget',
      widgetName: 'Image',
      widgetType: 'image',
      renderContent: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
      canNotBeAddedInside: (widget: Widget) => {
        return true;
      },
      defaultWidgetProperties: {
        class: 'min-h-48',
      }
    },
  ];

  moveWidgetOnScaffold(widget: Widget) {
    this.createLayer(widget);
  }

  private createLayer(widget: Widget) {
    console.log('Creating layer for widget', widget);
    if (this.appState.selectedLayer && this.appState.selectedLayer.widgetReference.canNotBeAddedInside && this.appState.selectedLayer.widgetReference.canNotBeAddedInside(widget)) {
      return;
    }

    const newLayer: Layer = {
      id: generateUniqueId(),
      sourceWidgetId: widget.id,
      widgetReference: widget,
      layerProperties: { ...widget.defaultWidgetProperties },
      children: []
    };

    this.appState.appViewSchema.layersMap[newLayer.id] = newLayer;

    console.log(this.appState.appViewSchema.layersMap);

    if (this.appState.selectedLayer) {
      this.appState = {
        ...this.appState,
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: this.insertLayerInSchema(this.appState.appViewSchema.layers, this.appState.selectedLayer.id, newLayer)
        }
      };
    } else {
      this.appState = {
        ...this.appState,
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: [...this.appState.appViewSchema.layers, newLayer]
        }
      };
    }

    // this.selectLayer(newLayer);

    console.log('app state',  this.appState);
  }


  private convertBgPropertyToTailwindClass(propertyKey: string, propertyValue: string): string {
    return `${propertyKey}-${propertyValue}`;
  }

  private insertLayerInSchema(layers: Layer[], destinationId: string, newLayer: Layer): Layer[] {
    return layers.map(layer => {
      if (layer.id === destinationId) {
        return {
          ...layer,
          children: [...layer.children, newLayer]
        };
      } else if (layer.children.length > 0) {
        return {
          ...layer,
          children: this.insertLayerInSchema(layer.children, destinationId, newLayer)
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

  clickOnLayerFromScaffold(event: MouseEvent) {
    event.stopPropagation();

    const id = (event!.target! as HTMLElement).closest('[data-layer-id]')?.getAttribute('data-layer-id');
    
    if (id) {
      this.selectLayer(this.appState.appViewSchema.layersMap[id]);
    }
  }

  contextMenuOnLayerFromScaffold(event: MouseEvent) {
    const id = (event!.target! as HTMLElement).closest('[data-layer-id]')?.getAttribute('data-layer-id');

    if (!id) {
      return;
    }

    this.selectLayer(this.appState.appViewSchema.layersMap[id]);
    
    const ref = this.contextMenuOverlay.open(event, EditorContextMenu, {
      id,
    });

    ref.instance.afterClosed.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {      
      if (result === 'delete') {
        this.removeLayer();
      }
    });
  }

  removeLayer() {
    if (!this.appState.selectedLayer) {
      console.warn('No layer selected for deletion');
      return;
    } 
    this.appState = {
      ...this.appState,
      appViewSchema: {
        ...this.appState.appViewSchema,
        layers: this.removeLayerInSchema(this.appState.appViewSchema.layers, this.appState.selectedLayer.id),
        layersMap: Object.keys(this.appState.appViewSchema.layersMap).reduce((result, key) => {
          if (key !== this.appState.selectedLayer!.id) {
            return {
              ...result,
              [key]: this.appState.appViewSchema.layersMap[key]
            };
          } else {
            return result;
          }
        }, {}) 
      }
    };

    this.unselectLayer();
    
    console.log('app state after delete',  this.appState);

  }

  private removeLayerInSchema(layers: Layer[], forDeleteId: string): Layer[] {
    return layers.reduce((result: Layer[], layer) => {
      if (layer.id === forDeleteId) {
        return result;
      } else if (layer.children.length > 0) {
        return [...result, { ...layer, children: this.removeLayerInSchema(layer.children, forDeleteId) }];
      } else {
        return [...result, layer];
      }
    }, []);
  }

  private selectLayer(layer: Layer) {
    console.log('Selected layer:', layer);
    this.appState.selectedLayer = layer;
  }

  private unselectLayer() {
    this.appState.selectedLayer = null;
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
