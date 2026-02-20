import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { CONTEXT_MENU_OVERLAY_DATA, ContextMenuOverlay } from '@app/shared/context-menu-overlay';

@Component({
  selector: 'de-context-menu',
  imports: [MatListModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenu {
  private data = inject(CONTEXT_MENU_OVERLAY_DATA);
  private contextMenuOverlay = inject(ContextMenuOverlay);

  ngOnInit() {
    console.log(this.data);
  }

  action(task: 'delete' | 'copy' | 'paste') {
    this.contextMenuOverlay.closeMenu(task);
  }
}
