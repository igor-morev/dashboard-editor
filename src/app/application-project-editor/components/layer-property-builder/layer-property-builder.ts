import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LayersEditor } from '@app/application-project-editor/services/layers-editor';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import {
  ColorName,
  ColorRange,
  ImageWidgetPropertyModel,
  Layer,
  LinkWidget,
  LinkWidgetPropertyModel,
  Widget,
  WidgetPropertyModel,
} from '@app/application-project-editor/types/application-editor.type';
import { ColorPalleteSelect } from '@app/application-project-editor/ui/color-pallete-select/color-pallete-select';
import { auditTime } from 'rxjs';

@Component({
  selector: 'de-layer-property-editor',
  imports: [ReactiveFormsModule, ColorPalleteSelect],
  templateUrl: './layer-property-builder.html',
  styleUrl: './layer-property-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerPropertyBuilder {
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private state = inject(ApplicationEditorState);
  private layersEditor = inject(LayersEditor);

  get appState() {
    return this.state.appState;
  }

  get selectedLayer() {
    return this.state.selectedlayer;
  }

  readonly formGroup = new FormGroup({
    backgroundColor: new FormControl<{
      name: ColorName;
      range: ColorRange;
    }>({
      name: '' as ColorName,
      range: null as ColorRange,
    }),
    textColor: new FormControl<{
      name: ColorName;
      range: ColorRange;
    }>({
      name: '' as ColorName,
      range: null as ColorRange,
    }),
    content: new FormControl(),
    layout: new FormControl(),
    textAlign: new FormControl(),
    background: new FormGroup({
      color: new FormControl<{
        name: ColorName;
        range: ColorRange;
      }>({
        name: '' as ColorName,
        range: null as ColorRange,
      }),
      image: new FormControl(),
      position: new FormControl(),
      repeat: new FormControl(),
      size: new FormControl(),
    }),
    link: new FormGroup({
      url: new FormControl(),
      openInNewTab: new FormControl<boolean>(false),
    }),
  });

  get backgroundColorFormGroup() {
    return this.formGroup.get('background')!.get('color') as FormGroup;
  }

  get textColorFormGroup() {
    return this.formGroup.get('textColor') as FormGroup;
  }

  constructor() {
    effect(() => {
      const layerPropertyModel = this.selectedLayer().layerPropertyModel;
      const widgetPropertyModel = this.selectedLayer().widgetReference.defaultWidgetPropertyModel;

      this.formGroup.patchValue(
        {
          backgroundColor: {
            name:
              layerPropertyModel.styles?.backgroundColor?.name! ||
              widgetPropertyModel?.styles?.backgroundColor?.name!,
            range:
              layerPropertyModel.styles?.backgroundColor?.range! ||
              widgetPropertyModel?.styles?.backgroundColor?.range,
          },
          content: this.selectedLayer().layerPropertyModel.content,
          layout: this.selectedLayer().layerPropertyModel.layout,
          textAlign: this.selectedLayer().layerPropertyModel.styles?.textAlign,
          textColor: {
            name:
              layerPropertyModel.styles?.color?.name! || widgetPropertyModel?.styles?.color?.name!,
            range:
              layerPropertyModel.styles?.color?.range! || widgetPropertyModel?.styles?.color?.range,
          },
        },
        {
          emitEvent: false,
        },
      );

      this.formGroup.get('background')!.patchValue(
        {
          color: {
            name:
              layerPropertyModel.styles?.background?.color?.name! ||
              widgetPropertyModel?.styles?.background?.color?.name!,
            range:
              layerPropertyModel.styles?.background?.color?.range! ||
              widgetPropertyModel?.styles?.background?.color?.range,
          },
          image:
            layerPropertyModel.styles?.background?.image !== undefined
              ? layerPropertyModel.styles?.background?.image
              : widgetPropertyModel?.styles?.background?.image,
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
          url:
            (layerPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.href ||
            (widgetPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.href,
          openInNewTab:
            (layerPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.target === '_blank' ||
            (widgetPropertyModel as LinkWidget['defaultWidgetPropertyModel'])?.target === '_blank',
        },
        {
          emitEvent: false,
        },
      );
    });

    this.formGroup.valueChanges
      .pipe(auditTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.updateLayerPropertyModel(this.selectedLayer().id, {
          ...this.selectedLayer().layerPropertyModel,
          styles: {
            ...this.selectedLayer().layerPropertyModel.styles,
            backgroundColor: {
              name: value.backgroundColor?.name!,
              range: value.backgroundColor?.range!,
            },
            color: {
              name: value.textColor?.name!,
              range: value.textColor?.range!,
            },
            textAlign: value.textAlign,
            background: {
              color: {
                name: value.background?.color?.name!,
                range: value.background?.color?.range!,
              },
              image: value.background?.image || '',
              position: value.background?.position,
              repeat: value.background?.repeat,
              size: value.background?.size,
            },
          },
          content: value.content,
          layout: value.layout,
          href: value.link?.url,
          target: value.link?.openInNewTab ? '_blank' : '_self',
        });
      });
  }

  private updateLayerPropertyModel(
    layerId: string,
    newPropertyModel: WidgetPropertyModel | LinkWidgetPropertyModel | ImageWidgetPropertyModel,
  ) {
    const layer = this.selectedLayer();
    if (layer) {
      const updatedLayer = this.postprocessLayer({
        ...layer,
        layerPropertyModel: {
          ...layer.layerPropertyModel,
          ...newPropertyModel,
        },
      } as Layer);

      console.log('Updated Layer:', updatedLayer);

      const updatedLayersTree = this.updateLayerInTree(
        this.appState.appViewSchema.layers,
        layerId,
        updatedLayer,
      );

      this.state.updateAppState({
        selectedLayer: updatedLayer,
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: updatedLayersTree,
          layersMap: this.updateLayersMap(updatedLayersTree, {}),
        },
      });
    }
  }

  postprocessLayer(layer: Layer): Layer {
    if (!layer.widgetReference.layoutTransformer) {
      return layer;
    }

    const updatedWidgetReference = {
      ...layer.widgetReference,
      children: layer.widgetReference.layoutTransformer(this.formGroup.controls.layout.value),
    } as Widget;

    const newLayer = this.layersEditor.createLayerForWidget(updatedWidgetReference, layer.id, 0);

    return {
      ...layer,
      children: newLayer.children.map((child) => ({
        ...child,
        parentId: layer.id,
      })),
    };
  }

  updateLayerInTree(layers: Layer[], layerId: string, updatedLayer: Layer): Layer[] {
    return layers.map((layer) => {
      if (layer.id === layerId) {
        console.log(1);
        return {
          ...layer,
          layerPropertyModel: {
            ...layer.layerPropertyModel,
            ...updatedLayer.layerPropertyModel,
          },
          children: updatedLayer.children,
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
}
