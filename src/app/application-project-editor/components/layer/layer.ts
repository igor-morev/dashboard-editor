import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Host,
  HostBinding,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { Layer } from '../../types/application-editor.type';
import { NgTemplateOutlet } from '@angular/common';
import { LayerContent } from './layer-content/layer-content';
import { LayerAttributeTransformPipe } from '../../pipes/layer-attribute-transform-pipe';
import {
  buildLayerStyleAttribute,
  buildLayerTailwindClasses,
} from '../../pipes/layer-attribute.util';

@Component({
  selector: 'de-layer',
  imports: [NgTemplateOutlet, LayerContent, LayerAttributeTransformPipe],
  templateUrl: './layer.html',
  styleUrl: './layer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @HostBinding('attr.data-layer-id') get layerId() {
    return this.layer().id;
  }

  buildLayerTailwindClasses = buildLayerTailwindClasses;
  buildLayerStyleAttribute = buildLayerStyleAttribute;
}
