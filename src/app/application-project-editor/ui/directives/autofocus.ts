import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[deAutofocus]',
})
export class Autofocus {
  private elementRef = inject(ElementRef);

  ngAfterViewInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    });
  }
}
