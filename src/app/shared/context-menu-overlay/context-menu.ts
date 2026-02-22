import { DestroyRef, inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';

import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

export const CONTEXT_MENU_OVERLAY_DATA = new InjectionToken<Record<string, any>>('CONTEXT_MENU_DATA');
@Injectable()
export class ContextMenuOverlayRef<R> {
  private destroyRef = inject(DestroyRef);
  private contextMenuOverlay = inject(ContextMenuOverlay);
  private closedSubject = new Subject<R | null>();

  readonly overlayRef = this.contextMenuOverlay.overlayRef;

  afterClosed() {
    return this.closedSubject.asObservable();
  }

  listenClickOutside() {
    this.contextMenuOverlay.overlayRef?.outsidePointerEvents().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
        this.closeMenu(null);
    })
  }

  closeMenu(result: R | null) {
    this.contextMenuOverlay.closeMenu();
    this.closedSubject.next(result);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContextMenuOverlay {
  private overlay = inject(Overlay);
  public overlayRef: OverlayRef | null = null;
  private injector = inject(Injector);

  open<C, R>(event: MouseEvent, componentType: Type<C>, data?: Record<string, any>): ContextMenuOverlayRef<R> {
    event.preventDefault();

    this.clearRef();
    
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy, minWidth: 250 });

    const injector = Injector.create({
      providers: [
        {
          provide: CONTEXT_MENU_OVERLAY_DATA,
          useValue: data
        },
        {
          provide: ContextMenuOverlayRef,
          useClass: ContextMenuOverlayRef,
        }
      ],
      parent: this.injector
    });
    
    const portal = new ComponentPortal(componentType, null, injector);
  
    this.overlayRef.attach(portal);

    return injector.get<ContextMenuOverlayRef<R>>(ContextMenuOverlayRef<R>);
  }

  private clearRef() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  closeMenu() {
    this.clearRef();
  }
}
