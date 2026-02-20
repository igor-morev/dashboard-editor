import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'de-layer-content',
  imports: [],
  templateUrl: './layer-content.html',
  styleUrl: './layer-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerContent {
  selected = input.required<boolean>();
}
