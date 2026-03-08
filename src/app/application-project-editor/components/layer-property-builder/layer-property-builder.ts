import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  LAYER_PROPERTY_CONVERTER,
  TailwindLayerPropertyConverter,
} from '@app/application-project-editor/services/layer-property-converter';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import {
  ImageWidgetPropertyModel,
  Layer,
  LinkWidget,
  LinkWidgetPropertyModel,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';

@Component({
  selector: 'de-layer-property-builder',
  imports: [ReactiveFormsModule],
  templateUrl: './layer-property-builder.html',
  styleUrl: './layer-property-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: LAYER_PROPERTY_CONVERTER,
      useClass: TailwindLayerPropertyConverter,
    },
  ],
})
export class LayerPropertyBuilder {
  private layerPropertyConverter = inject(LAYER_PROPERTY_CONVERTER);
  private state = inject(ApplicationEditorState);

  get appState() {
    return this.state.appState;
  }

  get selectedLayer() {
    return this.state.selectedlayer;
  }

  formGroup = new FormGroup({
    backgroundColorName: new FormControl(),
    backgroundColorRange: new FormControl(),
    colorName: new FormControl(),
    colorRange: new FormControl(),
    content: new FormControl(),
    textAlign: new FormControl(),
    background: new FormGroup({
      color: new FormGroup({
        name: new FormControl(),
        range: new FormControl(),
      }),
      image: new FormControl(),
      position: new FormControl(),
      repeat: new FormControl(),
      size: new FormControl(),
    }),
    link: new FormGroup({
        url: new FormControl(),
        openInNewTab: new FormControl<boolean>(false),
    })
  });

  constructor() {
    effect(() => {
      const layerPropertyModel = this.selectedLayer().layerPropertyModel;
      const widgetPropertyModel = this.selectedLayer().widgetReference.defaultWidgetPropertyModel;

      this.formGroup.patchValue(
        {
          backgroundColorName:
            layerPropertyModel.styles?.backgroundColor?.name ||
            widgetPropertyModel?.styles?.backgroundColor?.name,
          backgroundColorRange:
            layerPropertyModel.styles?.backgroundColor?.range ||
            widgetPropertyModel?.styles?.backgroundColor?.range,
          colorName:
            layerPropertyModel.styles?.color?.name || widgetPropertyModel?.styles?.color?.name,
          colorRange:
            layerPropertyModel.styles?.color?.range || widgetPropertyModel?.styles?.color?.range,
          content: this.selectedLayer().layerPropertyModel.content,
          textAlign: this.selectedLayer().layerPropertyModel.styles?.textAlign,
        },
        {
          emitEvent: false,
        },
      );

      this.formGroup.get('background')!.patchValue(
        {
          color: {
            name:
              layerPropertyModel.styles?.background?.color?.name ||
              widgetPropertyModel?.styles?.background?.color?.name,
            range:
              layerPropertyModel.styles?.background?.color?.range ||
              widgetPropertyModel?.styles?.background?.color?.range,
          },
          image:
            layerPropertyModel.styles?.background?.image ||
            widgetPropertyModel?.styles?.background?.image,
          position:
            layerPropertyModel.styles?.background?.position ||
            widgetPropertyModel?.styles?.background?.position,
          repeat:
            layerPropertyModel.styles?.background?.repeat ||
            widgetPropertyModel?.styles?.background?.repeat,
          size:
            layerPropertyModel.styles?.background?.size ||
            widgetPropertyModel?.styles?.background?.size,
        },
        {
          emitEvent: false,
        },
      );

        this.formGroup.get('link')!.patchValue(
          {
            url: (layerPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.href || (widgetPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.href,
            openInNewTab: (layerPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.target === '_blank' || (widgetPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.target === '_blank',
          },
          {
            emitEvent: false,
          },
        );
    });

    this.formGroup.valueChanges.subscribe((value) => {
      this.updateLayerPropertyModel(this.selectedLayer().id, {
        ...this.selectedLayer().layerPropertyModel,
        styles: {
          ...this.selectedLayer().layerPropertyModel.styles,
          backgroundColor: {
            name: value.backgroundColorName,
            range: value.backgroundColorRange,
          },
          color: {
            name: value.colorName,
            range: value.colorRange,
          },
          textAlign: value.textAlign,
          background: {
            color: {
              name: value.background?.color?.name,
              range: value.background?.color?.range,
            },
            image: value.background?.image,
            position: value.background?.position,
            repeat: value.background?.repeat,
            size: value.background?.size,
          },
        },
        content: value.content,
        href: value.link?.url,
        target: value.link?.openInNewTab ? '_blank' : '_self',
      });
    });
  }

  private updateLayerPropertyModel(layerId: string, newPropertyModel: WidgetPropertyModel | LinkWidgetPropertyModel | ImageWidgetPropertyModel) {
    const layer = this.selectedLayer();
    if (layer) {
      const updatedLayer = {
        ...layer,
        layerPropertyModel: {
          ...layer.layerPropertyModel,
          ...newPropertyModel,
        },
      };

      this.state.updateAppState({
        selectedLayer: updatedLayer,
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: this.updateLayerInTree(this.appState.appViewSchema.layers, layerId, updatedLayer),
          layersMap: {
            ...this.appState.appViewSchema.layersMap,
            [layerId]: updatedLayer,
          },
        },
      });
    }
  }

  updateLayerInTree(layers: Layer[], layerId: string, updatedLayer: Layer): Layer[] {
    return layers.map((layer) => {
      if (layer.id === layerId) {
        return {
          ...layer,
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
}
