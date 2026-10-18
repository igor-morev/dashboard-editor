import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LayersEditor } from '@app/application-project-editor/services/layers-editor';
import { ApplicationEditorState } from '@app/application-project-editor/state/application-editor-state';
import { ColorName, ColorRange } from '@app/application-project-editor/types/config.type';
import { Layer } from '@app/application-project-editor/types/project.type';
import {
  LinkWidget,
  WidgetPropertyModel,
  LinkWidgetPropertyModel,
  ImageWidgetPropertyModel,
} from '@app/application-project-editor/types/widget.type';
import { ColorPalleteSelect } from '@app/application-project-editor/ui/color-pallete-select/color-pallete-select';
import { ImageSourceInput } from '@app/application-project-editor/ui/image-source-input/image-source-input';
import { auditTime } from 'rxjs';

@Component({
  selector: 'de-layer-property-editor',
  imports: [ReactiveFormsModule, ColorPalleteSelect, ImageSourceInput],
  templateUrl: './layer-property-builder.html',
  styleUrl: './layer-property-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerPropertyBuilder {
  private destroyRef = inject(DestroyRef);
  private state = inject(ApplicationEditorState);
  private layersEditor = inject(LayersEditor);

  get appState() {
    return this.state.appState;
  }

  get hasStyleFields(): boolean {
    const styles = this.selectedLayer().widgetReference.propertyConfig?.styles;
    return !!(styles?.textAlign || styles?.backgroundColor || styles?.background || styles?.color);
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
      const layer = this.selectedLayer();
      const layerPropertyModel = layer.layerPropertyModel;
      const widgetPropertyModel = layer.widgetReference.defaultWidgetPropertyModel;
      const layerStyles = layerPropertyModel.styles;
      const widgetStyles = widgetPropertyModel?.styles;

      this.formGroup.patchValue(
        {
          backgroundColor: {
            name: this.pick(layerStyles?.backgroundColor?.name, widgetStyles?.backgroundColor?.name),
            range: this.pick(
              layerStyles?.backgroundColor?.range,
              widgetStyles?.backgroundColor?.range,
            ),
          },
          content: layerPropertyModel.content,
          layout: layerPropertyModel.layout,
          textAlign: layerStyles?.textAlign,
          textColor: {
            name: this.pick(layerStyles?.color?.name, widgetStyles?.color?.name),
            range: this.pick(layerStyles?.color?.range, widgetStyles?.color?.range),
          },
        },
        { emitEvent: false },
      );

      this.formGroup.get('background')!.patchValue(
        {
          color: {
            name: this.pick(
              layerStyles?.background?.color?.name,
              widgetStyles?.background?.color?.name,
            ),
            range: this.pick(
              layerStyles?.background?.color?.range,
              widgetStyles?.background?.color?.range,
            ),
          },
          // Unlike the other fields, an explicitly-cleared image (empty string) should stick —
          // only fall back to the widget default when the layer never set it at all.
          image:
            layerStyles?.background?.image !== undefined
              ? layerStyles?.background?.image
              : widgetStyles?.background?.image,
          position: this.pick(layerStyles?.background?.position, widgetStyles?.background?.position),
          repeat: this.pick(layerStyles?.background?.repeat, widgetStyles?.background?.repeat),
          size: this.pick(layerStyles?.background?.size, widgetStyles?.background?.size),
        },
        { emitEvent: false },
      );

      const linkLayerModel = layerPropertyModel as LinkWidget['defaultWidgetPropertyModel'];
      const linkWidgetModel = widgetPropertyModel as LinkWidget['defaultWidgetPropertyModel'];

      this.formGroup.get('link')!.patchValue(
        {
          url: this.pick(linkLayerModel?.href, linkWidgetModel?.href),
          openInNewTab: linkLayerModel?.target === '_blank' || linkWidgetModel?.target === '_blank',
        },
        { emitEvent: false },
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

  /** Falls back to the widget's default value when the layer hasn't overridden it. */
  private pick<T>(layerValue: T | undefined, widgetValue: T | undefined): T {
    return (layerValue || widgetValue) as T;
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

      const updatedLayersTree = this.layersEditor.updateLayerInTree(
        this.appState.appViewSchema.layers,
        layerId,
        updatedLayer,
      );

      this.state.updateAppState({
        selectedLayer: updatedLayer,
        appViewSchema: {
          ...this.appState.appViewSchema,
          layers: updatedLayersTree,
          layersMap: this.layersEditor.updateLayersMap(updatedLayersTree, {}),
        },
      });
    }
  }

  postprocessLayer(layer: Layer): Layer {
    if (layer.widgetReference.defaultWidgetPropertyModel?.onUpdate) {
      layer.widgetReference.defaultWidgetPropertyModel.onUpdate(layer.layerPropertyModel.content as string);
    }

    if (!layer.widgetReference.layoutTransformer) {
      return layer;
    }

    return this.layersEditor.rebuildLayerByLayout(layer, this.formGroup.value.layout!);
  }
}
