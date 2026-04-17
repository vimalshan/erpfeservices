import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'shared-password',
  imports: [CommonModule, FormsModule, PasswordModule],
  templateUrl: './custom-password.component.html',
  styleUrl: './custom-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomPasswordComponent),
      multi: true,
    },
  ],
})
export class CustomPasswordComponent implements ControlValueAccessor {
  public inputId = input<string>();
  public placeholder = input<string>('');
  public toggleMask = input<boolean>(true);
  public feedback = input<boolean>(true);
  public disabled = input<boolean>(false);
  public readonly = input<boolean>(false);
  public passwordClass = input<string>();
  public promptLabel = input<string>();
  public weakLabel = input<string>();
  public mediumLabel = input<string>();
  public strongLabel = input<string>();

  value = '';
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
