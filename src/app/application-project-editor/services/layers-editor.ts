import { inject, Injectable } from '@angular/core';
import { Widget } from '../types/widget.type';
import { generateUniqueId } from '../utils/editor';
import { Layer } from '../types/project.type';
import { LayerDto } from '@app/api/types/project';
import { WidgetsState } from '../state/widgets-state';

/**
 * LayersEditor is responsible for managing the layers tree structure in the application editor.
 * It provides methods to create layers from widgets, update layers in the tree, insert and remove layers,
 * duplicate layer trees, and recalculate layer indices after modifications.
 * This service abstracts the logic for manipulating the layers tree, allowing other parts of the application
 *
 */
@Injectable({
  providedIn: 'root',
})
export class LayersEditor {
  private widgetsState = inject(WidgetsState);
  private widgetTypeRegistry: Record<string, Widget> | null = null;

  createLayerForWidget(widget: Widget, parentId: string | null, index = 0): Layer {
    const layerId = generateUniqueId();

    const newLayer: Layer = {
      id: layerId,
      isVisible: true,
      locked: false,
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

  updateLayerInTree(layers: Layer[], layerId: string, updatedLayer: Layer): Layer[] {
    return layers.map((layer) => {
      if (layer.id === layerId) {
        return {
          ...layer,
          ...updatedLayer,
          layerPropertyModel: {
            ...layer.layerPropertyModel,
            ...updatedLayer.layerPropertyModel,
          },
        };
      } else if (layer.children.length > 0) {
        return {
          ...layer,
          children: this.updateLayerInTree(layer.children, layerId, updatedLayer),
        };
      } else {
        return layer;
      }
    });
  }

  updateLayersMap(layers: Layer[], layersMap: Record<string, Layer>): Record<string, Layer> {
    layers.forEach((layer) => {
      layersMap[layer.id] = layer;

      if (layer.children.length > 0) {
        this.updateLayersMap(layer.children, layersMap);
      }
    });

    return layersMap;
  }

  insertLayerInSchema(
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

  batchUpdateChildrenLayersInSchema(
    layers: Layer[],
    destinationId: string,
    newChildrenLayers: Layer[],
  ): Layer[] {
    return layers.map((layer) => {
      if (layer.id === destinationId) {
        return {
          ...layer,
          children: newChildrenLayers,
        };
      } else if (layer.children.length > 0) {
        return {
          ...layer,
          children: this.batchUpdateChildrenLayersInSchema(
            layer.children,
            destinationId,
            newChildrenLayers,
          ),
        };
      } else {
        return layer;
      }
    });
  }

  moveLayerInSchema(
    layers: Layer[],
    layer: Layer,
    destinationId: string,
    insertIndex?: number,
  ): Layer[] {
    const layersWithoutMovedLayer = this.removeLayerInSchema(layers, layer.id);
    return this.insertLayerInSchema(
      layersWithoutMovedLayer,
      destinationId,
      {
        ...layer,
        parentId: destinationId,
      },
      insertIndex,
    );
  }

  removeLayerInSchema(layers: Layer[], forDeleteId: string): Layer[] {
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

  duplicateLayerTree(layer: Layer, parentId = layer.parentId): Layer {
    const layerId = generateUniqueId();

    const newLayer: Layer = {
      ...layer,
      id: layerId,
      parentId,
      layerPropertyModel: Object.assign({}, layer.layerPropertyModel),
      widgetReference: Object.assign(
        {},
        {
          ...layer.widgetReference,
          defaultWidgetPropertyModel: {
            ...layer.widgetReference.defaultWidgetPropertyModel,
          },
        },
      ) as Widget,
      children: layer.children
        ? layer.children.map((layerChild) => this.duplicateLayerTree(layerChild, layerId))
        : [],
    };

    return newLayer;
  }

  recalculateLayersIndex(layers: Layer[]): Layer[] {
    return layers.map((layer, index) => ({
      ...layer,
      index,
      children: this.recalculateLayersIndex(layer.children),
    }));
  }

  rebuildLayerByLayout<T extends string>(layer: Layer, layout: T): Layer {
    if (!layer.widgetReference.layoutTransformer) {
      return layer;
    }

    const updatedWidgetReference = {
      ...layer.widgetReference,
      children: layer.widgetReference.layoutTransformer(layout, layer.layerPropertyModel.content),
    } as Widget;

    const newLayer = this.createLayerForWidget(updatedWidgetReference, layer.id, 0);

    return {
      ...layer,
      layerPropertyModel: {
        ...layer.layerPropertyModel,
      },
      children: newLayer.children.map((child) => ({
        ...child,
        parentId: layer.id,
      })),
    };
  }

  /**
   * Serializes the in-memory layer tree to the wire format shared with the backend
   * (used for both Export and Save — see `LayerDto` in api/types/project.ts).
   */
  toLayerDto(layers: Layer[]): LayerDto[] {
    return layers.map((layer) => ({
      id: layer.id,
      isVisible: layer.isVisible,
      widgetReference: {
        widgetType: layer.widgetReference.widgetType,
      },
      layerPropertyModel: {
        defaultClass: layer.layerPropertyModel.defaultClass,
        class: layer.layerPropertyModel.class,
        content: layer.layerPropertyModel.content,

        label: 'label' in layer.layerPropertyModel ? layer.layerPropertyModel.label : undefined,
        placeholder:
          'placeholder' in layer.layerPropertyModel
            ? layer.layerPropertyModel.placeholder
            : undefined,
        name: 'name' in layer.layerPropertyModel ? layer.layerPropertyModel.name : undefined,
        required:
          'required' in layer.layerPropertyModel ? layer.layerPropertyModel.required : undefined,
        options:
          'options' in layer.layerPropertyModel ? layer.layerPropertyModel.options : undefined,
        type: 'type' in layer.layerPropertyModel ? layer.layerPropertyModel.type : undefined,
        inputType:
          'inputType' in layer.layerPropertyModel ? layer.layerPropertyModel.inputType : undefined,

        background: layer.layerPropertyModel.styles
          ?.background as LayerDto['layerPropertyModel']['background'],
        color: layer.layerPropertyModel.styles?.color as LayerDto['layerPropertyModel']['color'],

        href: 'href' in layer.layerPropertyModel ? layer.layerPropertyModel.href : undefined,
        target: 'target' in layer.layerPropertyModel ? layer.layerPropertyModel.target : undefined,
      },
      children: this.toLayerDto(layer.children),
    }));
  }

  /**
   * Reconstructs the in-memory layer tree from the saved wire format. The `widgetReference`
   * on a `LayerDto` only carries a `widgetType` string, so each node is re-attached to a
   * representative `Widget` definition from the widget library, looked up by that type —
   * the saved `layerPropertyModel` (not the widget's defaults) is what drives its actual content/styling.
   */
  toLayer(dtos: LayerDto[], parentId: string | null): Layer[] {
    return dtos.map((dto, index) => {
      const widget = this.getWidgetByType(dto.widgetReference.widgetType);

      const layer: Layer = {
        id: dto.id,
        parentId,
        sourceWidgetId: widget.id,
        widgetReference: widget,
        index,
        isVisible: dto.isVisible,
        locked: false,
        layerPropertyModel: {
          defaultClass: dto.layerPropertyModel.defaultClass,
          class: dto.layerPropertyModel.class,
          content: dto.layerPropertyModel.content,
          label: dto.layerPropertyModel.label,
          placeholder: dto.layerPropertyModel.placeholder,
          name: dto.layerPropertyModel.name,
          required: dto.layerPropertyModel.required,
          options: dto.layerPropertyModel.options,
          type: dto.layerPropertyModel.type,
          inputType: dto.layerPropertyModel.inputType,
          href: dto.layerPropertyModel.href,
          target: dto.layerPropertyModel.target,
          styles: {
            background: dto.layerPropertyModel.background,
            color: dto.layerPropertyModel.color,
          },
        } as Layer['layerPropertyModel'],
        children: [],
      };

      layer.children = this.toLayer(dto.children, layer.id);

      return layer;
    });
  }

  private getWidgetByType(widgetType: string): Widget {
    if (!this.widgetTypeRegistry) {
      this.widgetTypeRegistry = {};
      const flatten = (widgets: Widget[]) => {
        widgets.forEach((widget) => {
          if (!this.widgetTypeRegistry![widget.widgetType]) {
            this.widgetTypeRegistry![widget.widgetType] = widget;
          }
          if (widget.children) {
            flatten(widget.children);
          }
        });
      };
      flatten(this.widgetsState.widgets);
    }

    return this.widgetTypeRegistry[widgetType] ?? this.widgetsState.widgets[0];
  }
}
