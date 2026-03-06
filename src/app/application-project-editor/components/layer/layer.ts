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
import { LayerClassTransformPipe } from './layer-class-transform-pipe';

@Component({
  selector: 'de-layer',
  imports: [NgTemplateOutlet, LayerContent, LayerClassTransformPipe],
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

  @HostBinding('attr.data-layer-id') get layerId() {
    return this.layer().id;
  }
}
