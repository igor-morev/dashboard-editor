import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  forwardRef,
  Host,
  HostBinding,
  Inject,
  InjectionToken,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import {
  ButtonWidget,
  FormWidget,
  LinkWidget,
  SelectInputWidget,
  TextareaWidget,
  TextInputWidget,
} from '../../types/widget.type';
import { NgTemplateOutlet } from '@angular/common';
import { LayerContent } from './layer-content/layer-content';
import { LayerAttributeTransformPipe } from '../../pipes/layer-attribute-transform-pipe';
import {
  buildLayerStyleAttribute,
  buildLayerTailwindClasses,
} from '../../pipes/layer-attribute.util';
import { MatIconModule } from '@angular/material/icon';
import { Layer } from '@app/application-project-editor/types/project.type';

export const LAYER_REF = new InjectionToken<LayerComponent>('LAYER');

@Component({
  selector: 'de-layer',
  imports: [NgTemplateOutlet, MatIconModule, LayerContent, LayerAttributeTransformPipe],
  templateUrl: './layer.html',
  styleUrl: './layer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: LAYER_REF,
      useExisting: forwardRef(() => LayerComponent),
    },
  ],
})
export class LayerComponent {
  layer = input.required<Layer>();
  layersTemplate = input.required<
    TemplateRef<{
      $implicit: Layer[];
    }>
  >();

  selected = input.required<boolean>();
  highlighted = input<boolean>();

  editingLayer = input<boolean>();

  onStartEditingLayer = output<void>();
  onSaveEditingLayerName = output<string>();
  onCancelEditingLayer = output<void>();

  @HostBinding('attr.data-layer-id') get layerId() {
    return this.layer().id;
  }

  @HostBinding('attr.data-layer-type') get layerType() {
    return this.layer().widgetReference.widgetType;
  }

  buildLayerTailwindClasses = buildLayerTailwindClasses;
  buildLayerStyleAttribute = buildLayerStyleAttribute;

  ngOnInit() {}

  get linkWidgetReference() {
    return this.layer().widgetReference as LinkWidget;
  }

  get linkLayerPropertyModel() {
    return this.layer().layerPropertyModel as LinkWidget['defaultWidgetPropertyModel'];
  }

  get formLayerPropertyModel() {
    return this.layer().layerPropertyModel as FormWidget['defaultWidgetPropertyModel'];
  }

  get buttonLayerPropertyModel() {
    return this.layer().layerPropertyModel as ButtonWidget['defaultWidgetPropertyModel'];
  }

  get textInputLayerPropertyModel() {
    return this.layer().layerPropertyModel as TextInputWidget['defaultWidgetPropertyModel'];
  }

  get textareaInputLayerPropertyModel() {
    return this.layer().layerPropertyModel as TextareaWidget['defaultWidgetPropertyModel'];
  }

  get selectInputLayerPropertyModel() {
    return this.layer().layerPropertyModel as SelectInputWidget['defaultWidgetPropertyModel'];
  }
}
