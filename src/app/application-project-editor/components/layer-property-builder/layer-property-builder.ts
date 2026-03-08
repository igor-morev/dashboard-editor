import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  LAYER_PROPERTY_CONVERTER,
  TailwindLayerPropertyConverter,
} from '@app/application-project-editor/services/layer-property-converter';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import {
  Layer,
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
    });

    this.formGroup.valueChanges.subscribe((value) => {
      this.updateLayerPropertyModel(this.selectedLayer().id, {
        ...this.selectedLayer().layerPropertyModel,
        styles: {
          ...this.selectedLayer().layerPropertyModel.styles!,
          backgroundColor: {
            name: this.formGroup.get('backgroundColorName')!.value!,
            range: this.formGroup.get('backgroundColorRange')!.value!,
          },
          color: {
            name: this.formGroup.get('colorName')!.value!,
            range: this.formGroup.get('colorRange')!.value!,
          },
          textAlign: this.formGroup.get('textAlign')!.value!,
          background: {
            color: {
              name: this.formGroup.get('background')!.get('color')!.get('name')!.value!,
              range: this.formGroup.get('background')!.get('color')!.get('range')!.value!,
            },
            image: this.formGroup.get('background')!.get('image')!.value!,
            position: this.formGroup.get('background')!.get('position')!.value!,
            repeat: this.formGroup.get('background')!.get('repeat')!.value!,
            size: this.formGroup.get('background')!.get('size')!.value!,
          },
        },
        content: this.formGroup.get('content')!.value!,
      });
    });
  }

  private updateLayerPropertyModel(layerId: string, newPropertyModel: WidgetPropertyModel) {
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
