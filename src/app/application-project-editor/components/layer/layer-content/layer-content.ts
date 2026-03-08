import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LAYER_REF } from '../layer';

@Component({
  selector: 'de-layer-content',
  imports: [],
  templateUrl: './layer-content.html',
  styleUrl: './layer-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerContent {
  // TODO: get this data from parent layer component via injection token
  layerRef = inject(LAYER_REF);
  selected = input.required<boolean>();
  highlighted = input<boolean>();

  ngOnInit() {
    console.log(this.layerRef);
  }
}
