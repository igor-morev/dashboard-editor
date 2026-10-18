import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

type ImageSourceMode = 'url' | 'upload';

@Component({
  selector: 'de-image-source-input',
  imports: [],
  templateUrl: './image-source-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageSourceInput),
      multi: true,
    },
  ],
})
export class ImageSourceInput implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  value = signal('');
  mode = signal<ImageSourceMode>('url');
  disabled = signal(false);
  error = signal<string | null>(null);

  hasPreview = computed(() => !!this.value());

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    this.mode.set(value?.startsWith('data:') ? 'upload' : 'url');
    this.error.set(null);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  setMode(mode: ImageSourceMode): void {
    this.mode.set(mode);
    this.error.set(null);
  }

  onUrlChange(url: string): void {
    this.value.set(url);
    this.error.set(null);
    this.onChange(url);
    this.onTouched();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      this.error.set(
        `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB — please use an image under 3MB.`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.value.set(dataUrl);
      this.error.set(null);
      this.onChange(dataUrl);
      this.onTouched();
    };
    reader.onerror = () => {
      this.error.set(`Couldn't read "${file.name}" — please try another file.`);
    };
    reader.readAsDataURL(file);
  }

  clear(): void {
    this.value.set('');
    this.error.set(null);
    this.onChange('');
    this.onTouched();
  }
}
