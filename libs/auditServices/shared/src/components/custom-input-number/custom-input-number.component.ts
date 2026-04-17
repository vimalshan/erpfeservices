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
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'shared-input-number',
  imports: [CommonModule, FormsModule, InputNumberModule],
  templateUrl: './custom-input-number.component.html',
  styleUrl: './custom-input-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputNumberComponent),
      multi: true,
    },
  ],
})
export class CustomInputNumberComponent implements ControlValueAccessor {
  public inputId = input<string>();
  public placeholder = input<string>('');
  public min = input<number>();
  public max = input<number>();
  public step = input<number>(1);
  public showButtons = input<boolean>(false);
  public mode = input<'decimal' | 'currency'>('decimal');
  public currency = input<string>();
  public locale = input<string>();
  public minFractionDigits = input<number>();
  public maxFractionDigits = input<number>();
  public disabled = input<boolean>(false);
  public readonly = input<boolean>(false);
  public inputClass = input<string>();

  value: number | null = null;
  isDisabled = false;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: number | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
