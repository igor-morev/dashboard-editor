import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter } from 'rxjs';
import { ColorName, ColorRange } from '@app/application-project-editor/types/config.type';

interface ColorSwatch {
  name: ColorName;
  range: ColorRange;
}

interface ColorFormGroup extends FormGroup {
  controls: {
    name: FormControl<string>;
    range: FormControl<string>;
  };
}

@Component({
  selector: 'de-color-pallete-select',
  imports: [NgClass, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './color-pallete-select.html',
  styleUrl: './color-pallete-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPalleteSelect),
      multi: true,
    },
  ],
})
export class ColorPalleteSelect implements ControlValueAccessor {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  private onChange: (value: ColorSwatch) => void = () => {};
  private onTouched: () => void = () => {};

  formGroup: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    range: new FormControl<string>(''),
  });

  colorNames = input<ColorName[]>([]);
  colorRanges = input<ColorRange[]>([]);
  inline = input<boolean>(false);
  colorSelected = output<ColorSwatch>();

  colors: ColorSwatch[] = [];

  colorParametersEffect = effect(() => {
    this.generateColorGrid();
  });

  constructor() {
    this.formGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value.name) {
        this.onChange({
          name: value.name,
          range: value.range,
        });
      }
    });
  }

  writeValue(value: ColorSwatch | null): void {
    if (value) {
      this.formGroup.patchValue(
        {
          name: value.name,
          range: value.range,
        },
        {
          emitEvent: false,
        },
      );

      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: ColorSwatch) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  selectColor(name: ColorName, range: ColorRange): void {
    this.formGroup.patchValue({ name, range });
    this.colorSelected.emit({ name, range });
    this.closePopup();

    this.cdr.markForCheck();
  }

  isSelected(color: ColorSwatch): boolean {
    if (this.formGroup.value.name === 'white' || this.formGroup.value.name === 'black') {
      return this.formGroup.value.name === color.name;
    }

    return this.formGroup.value.name === color.name && this.formGroup.value.range === color.range;
  }

  toggleMenu(menuTemplate: TemplateRef<any>, trigger: HTMLElement): void {
    console.log(1);
    if (this.overlayRef?.hasAttached()) {
      this.closePopup();
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'overlay-panel',
    });

    const portal = new TemplatePortal(menuTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef
      .outsidePointerEvents()
      .pipe(
        filter(
          (value) =>
            !(value.target as HTMLElement).closest(
              trigger.className
                .split(' ')
                .map((c) => `.${c}`)
                .join(''),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.closePopup();
      });
  }

  closePopup(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private generateColorGrid(): void {
    this.colors = [];
    this.colorNames().forEach((name) => {
      if (name === 'white' || name === 'black') {
        this.colors.push({
          name,
          range: null,
        });
      } else {
        this.colorRanges().forEach((range) => {
          this.colors.push({
            name,
            range,
          });
        });
      }
    });
  }
}
