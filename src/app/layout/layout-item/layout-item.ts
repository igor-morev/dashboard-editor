import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'de-layout-item',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './layout-item.html',
  styleUrl: './layout-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutItemComponent {
  item = input.required();
  closeEvent = output();

  close() {
    this.closeEvent.emit();
  }

}
