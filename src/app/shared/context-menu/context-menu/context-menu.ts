import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { CONTEXT_MENU_DATA, ContextMenu } from '../context-menu';

@Component({
  selector: 'de-context-menu',
  imports: [MatListModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {
  private data = inject(CONTEXT_MENU_DATA);
  private contextMenu = inject(ContextMenu<ContextMenuComponent, 'delete' | 'copy' | 'paste'>);

  ngOnInit() {
    console.log(this.data);
  }

  action(task: 'delete' | 'copy' | 'paste') {
    this.contextMenu.closeMenu(task);
  }
}
