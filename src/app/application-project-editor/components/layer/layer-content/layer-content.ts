import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LAYER_REF } from '../layer';

@Component({
  selector: 'de-layer-content',
  imports: [],
  templateUrl: './layer-content.html',
  styleUrl: './layer-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerContent {
  private readonly layerRef = inject(LAYER_REF);

  get layer() {
    return this.layerRef.layer;
  }

  get selected() {
    return this.layerRef.selected
  }

  get highlighted() {
    return this.layerRef.highlighted
  }
}
