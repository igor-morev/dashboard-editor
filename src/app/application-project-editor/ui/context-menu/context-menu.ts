import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CONTEXT_MENU_OVERLAY_DATA, ContextMenuOverlayRef } from '@app/shared/context-menu-overlay';
import {
  EditorCommand,
  Layer,
} from '@app/application-project-editor/types/application-editor.type';

@Component({
  selector: 'de-context-menu',
  imports: [MatListModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContextMenu implements OnInit, OnDestroy {
  private data = inject<Layer>(CONTEXT_MENU_OVERLAY_DATA);
  private contextMenuOverlayRef = inject(ContextMenuOverlayRef);

  get layer() {
    return this.data;
  }

  ngOnInit() {
    this.contextMenuOverlayRef.listenClickOutside();
  }

  ngOnDestroy(): void {
    this.contextMenuOverlayRef.unlistenClickOutside();
  }

  action(command: EditorCommand) {
    this.contextMenuOverlayRef.closeMenu(command);
  }
}
