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
  });

  constructor() {
    effect(() => {
      const layerPropertyModel = this.selectedLayer()?.layerPropertyModel;
      const widgetPropertyModel = this.selectedLayer()?.widgetReference.defaultWidgetPropertyModel;

      this.formGroup.patchValue(
        {
          backgroundColorName:
            layerPropertyModel.styles?.backgroundColor?.name ||
            widgetPropertyModel?.styles?.backgroundColor?.name,
          backgroundColorRange:
            layerPropertyModel.styles?.backgroundColor?.range ||
            widgetPropertyModel?.styles?.backgroundColor?.range,
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
        },
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
