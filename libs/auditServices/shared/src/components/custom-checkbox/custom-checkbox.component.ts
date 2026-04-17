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
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'shared-checkbox',
  imports: [CommonModule, FormsModule, CheckboxModule],
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckboxComponent),
      multi: true,
    },
  ],
})
export class CustomCheckboxComponent implements ControlValueAccessor {
  public inputId = input<string>();
  public label = input<string>();
  public binary = input<boolean>(true);
  public disabled = input<boolean>(false);
  public readonly = input<boolean>(false);
  public checkboxClass = input<string>();

  value = false;
  isDisabled = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.value = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onCheckedChange(value: boolean): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
