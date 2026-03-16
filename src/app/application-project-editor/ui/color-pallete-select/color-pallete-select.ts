import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  Input,
  input,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  ColorName,
  ColorRange,
} from '@app/application-project-editor/types/application-editor.type';

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
  imports: [NgClass, ReactiveFormsModule],
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
  private cdr = inject(ChangeDetectorRef);

  private onChange: (value: ColorSwatch) => void = () => {};
  private onTouched: () => void = () => {};

  formGroup: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    range: new FormControl<string>(''),
  });

  colorNames = input<ColorName[]>([]);
  colorRanges = input<ColorRange[]>([]);
  colorSelected = output<ColorSwatch>();

  colors: ColorSwatch[] = [];

  colorParametersEffect = effect(() => {
    this.generateColorGrid();
  });

  constructor() {
    this.formGroup.valueChanges.subscribe((value) => {
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
  }

  isSelected(color: ColorSwatch): boolean {
    if (this.formGroup.value.name === 'white' || this.formGroup.value.name === 'black') {
      return this.formGroup.value.name === color.name;
    }

    return this.formGroup.value.name === color.name && this.formGroup.value.range === color.range;
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
