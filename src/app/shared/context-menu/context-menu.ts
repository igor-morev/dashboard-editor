import { inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';

import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';

interface DeContextMenu<C = any, R = any> {
  open: (event: MouseEvent, componentType: Type<C>) => {
    afterClosed: () => Observable<R>
  };
  closeMenu: (option: R) => void;
}

export const CONTEXT_MENU_DATA = new InjectionToken<Record<string, any>>('CONTEXT_MENU_DATA');

@Injectable({
  providedIn: 'root'
})
export class ContextMenu<C, R> implements DeContextMenu<C, R> {
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private injector = inject(Injector);
  closeSubject: Subject<R> = new Subject<R>();

  open<C, R>(event: MouseEvent, componentType: Type<C>, data?: Record<string, any>) {
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
        provide: CONTEXT_MENU_DATA,
        useValue: data
      }], parent: this.injector,
    });
    
    const portal = new ComponentPortal(componentType, null, injector);

    // this.overlayRef.outsidePointerEvents().subscribe((value) => {
    //   this.close();
    // });

  
    this.overlayRef.attach(portal);  

    return {
      afterClosed: () => this.closeSubject.asObservable() as unknown as Observable<R>
    };  
  }

  private clearRef() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  closeMenu(result: R) {
    this.clearRef();

    this.closeSubject.next(result);
  }
}
