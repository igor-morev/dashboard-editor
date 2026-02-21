import { ComponentRef, inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';

import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';

export const CONTEXT_MENU_OVERLAY_DATA = new InjectionToken<Record<string, any>>('CONTEXT_MENU_DATA');

// TBD
@Injectable()
export class ContextMenuOverlayRef {
  constructor(private overlayRef: OverlayRef) {}

  afterClosed() {

  }

  close() {
    this.overlayRef.dispose();
  }

  outsidePointerEvents() {
    return this.overlayRef.outsidePointerEvents();
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContextMenuOverlay {
  private overlay = inject(Overlay);
  public overlayRef: OverlayRef | null = null;
  private injector = inject(Injector);

  open<C>(event: MouseEvent, componentType: Type<C>, data?: Record<string, any>): ComponentRef<C> {
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
      providers: [{
        provide: CONTEXT_MENU_OVERLAY_DATA,
        useValue: data
      }], parent: this.injector,
    });
    
    const portal = new ComponentPortal(componentType, null, injector);
    

    // this.overlayRef.outsidePointerEvents().subscribe((value) => {
    //   this.closeMenu(null);
    // });

  
    return this.overlayRef.attach(portal);  
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
