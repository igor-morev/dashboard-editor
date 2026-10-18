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
  private widgetIdRegistry: Record<string, Widget> | null = null;

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
        id: layer.widgetReference.id,
        widgetType: layer.widgetReference.widgetType,
      },
      layerPropertyModel: {
        defaultClass: layer.layerPropertyModel.defaultClass,
        class: layer.layerPropertyModel.class,
        layout: layer.layerPropertyModel.layout,
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
   * Reconstructs the in-memory layer tree from the saved wire format. Each node is re-attached
   * to a `Widget` definition from the widget library, looked up **by id** (`widgetReference.id`)
   * — that identifies the *specific* widget definition, e.g. `hero-widget` vs `features-widget`,
   * which otherwise share `widgetType: 'section'` and would be indistinguishable by type alone.
   * Falls back to a type-based lookup only if the id isn't found (older saved data, or the
   * widget library changed) — the saved `layerPropertyModel` (not the widget's defaults) is
   * what drives actual content/styling either way.
   */
  toLayer(dtos: LayerDto[], parentId: string | null): Layer[] {
    return dtos.map((dto, index) => {
      const widget =
        this.getWidgetById(dto.widgetReference.id) ??
        this.getWidgetByType(dto.widgetReference.widgetType);

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
          layout: dto.layerPropertyModel.layout,
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

  private buildWidgetRegistries(): void {
    if (this.widgetTypeRegistry && this.widgetIdRegistry) {
      return;
    }

    this.widgetTypeRegistry = {};
    this.widgetIdRegistry = {};

    const flatten = (widgets: Widget[]) => {
      widgets.forEach((widget) => {
        if (!this.widgetTypeRegistry![widget.widgetType]) {
          this.widgetTypeRegistry![widget.widgetType] = widget;
        }
        if (!this.widgetIdRegistry![widget.id]) {
          this.widgetIdRegistry![widget.id] = widget;
        }
        if (widget.children) {
          flatten(widget.children);
        }
      });
    };
    flatten(this.widgetsState.widgets);
  }

  /**
   * Looks up the *specific* widget definition a layer was created from (e.g. `hero-widget`
   * distinctly from `section-widget`, even though both share `widgetType: 'section'`). Returns
   * `null` (not the unknown-widget placeholder) when there's no id to look up or no match, so
   * callers can fall back to `getWidgetByType` instead.
   */
  private getWidgetById(sourceWidgetId: string | undefined): Widget | null {
    if (!sourceWidgetId) {
      return null;
    }

    this.buildWidgetRegistries();
    return this.widgetIdRegistry![sourceWidgetId] ?? null;
  }

  private getWidgetByType(widgetType: string): Widget {
    this.buildWidgetRegistries();

    const match = this.widgetTypeRegistry![widgetType];
    if (match) {
      return match;
    }

    console.warn(
      `LayersEditor.getWidgetByType: no widget registered for widgetType "${widgetType}" — ` +
        `rendering a visible placeholder instead of silently substituting an unrelated widget.`,
    );
    return {
      id: `unknown-widget-${widgetType}`,
      widgetName: `Unknown widget (${widgetType})`,
      widgetType: 'section',
      defaultWidgetPropertyModel: {
        content: `⚠ Unknown widget type: ${widgetType}`,
      },
    } as Widget;
  }
}
