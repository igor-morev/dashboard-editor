import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'de-layer-content',
  imports: [],
  templateUrl: './layer-content.html',
  styleUrl: './layer-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerContent {
  // TODO: get this data from parent layer component
  selected = input.required<boolean>();
  highlighted = input<boolean>();
}
