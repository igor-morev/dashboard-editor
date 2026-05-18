import { Injectable } from '@angular/core';
import { Layer, Widget } from '../types/application-editor.type';
import { generateUniqueId } from '../utils/editor';

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
}
