import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { CONTEXT_MENU_OVERLAY_DATA, ContextMenuOverlay } from '@app/shared/context-menu-overlay';
import { EditorCommand } from '../types/app-builder.type';

@Component({
  selector: 'de-context-menu',
  imports: [MatListModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorContextMenu {
  private data = inject(CONTEXT_MENU_OVERLAY_DATA);
  private contextMenuOverlay = inject(ContextMenuOverlay);

  @Output() afterClosed = new EventEmitter<EditorCommand>()

  ngOnInit() {
    console.log(this.data);
  }

  action(command: EditorCommand) {
    this.contextMenuOverlay.closeMenu();
    this.afterClosed.emit(command);
  }
}
