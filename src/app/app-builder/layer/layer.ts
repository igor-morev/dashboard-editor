import { ChangeDetectionStrategy, Component, ContentChild, Host, HostBinding, input, signal, TemplateRef } from '@angular/core';
import { Layer } from '../types/app-builder.type';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'de-layer',
  imports: [NgTemplateOutlet],
  templateUrl: './layer.html',
  styleUrl: './layer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerComponent {
  layer = input.required<Layer>();
  layersTemplate = input.required<TemplateRef<{
    $implicit: Layer[];
  }>>();

  @HostBinding('attr.data-layer-id') get layerId(){
    return this.layer().id;
  }
}
