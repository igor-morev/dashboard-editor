import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { CONTEXT_MENU_OVERLAY_DATA, ContextMenuOverlay } from '@app/shared/context-menu-overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditorCommand } from '@app/application-project-editor/types/application-editor.type';

@Component({
  selector: 'de-context-menu',
  imports: [MatListModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorContextMenu implements OnInit {
  private destroyRef = inject(DestroyRef);
  private data = inject(CONTEXT_MENU_OVERLAY_DATA);
  private contextMenuOverlay = inject(ContextMenuOverlay);

  @Output() afterClosed = new EventEmitter<EditorCommand>()

  ngOnInit() {
    if (this.contextMenuOverlay.overlayRef) {
      this.contextMenuOverlay.overlayRef.outsidePointerEvents().pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        console.log('clicked outside');
        this.contextMenuOverlay.closeMenu();
        this.afterClosed.emit();
      });
    }
  }

  action(command: EditorCommand) {
    this.contextMenuOverlay.closeMenu();
    this.afterClosed.emit(command);
  }
}
