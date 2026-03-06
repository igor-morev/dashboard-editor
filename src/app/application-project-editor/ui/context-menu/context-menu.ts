import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CONTEXT_MENU_OVERLAY_DATA, ContextMenuOverlayRef } from '@app/shared/context-menu-overlay';
import { EditorCommand } from '@app/application-project-editor/types/application-editor.type';

@Component({
  selector: 'de-context-menu',
  imports: [MatListModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContextMenu {
  private data = inject(CONTEXT_MENU_OVERLAY_DATA);
  private contextMenuOverlayRef = inject(ContextMenuOverlayRef);

  ngOnInit() {
    console.log('Context menu data:', this.data);
    this.contextMenuOverlayRef.listenClickOutside();
  }

  action(command: EditorCommand) {
    this.contextMenuOverlayRef.closeMenu(command);
  }
}
