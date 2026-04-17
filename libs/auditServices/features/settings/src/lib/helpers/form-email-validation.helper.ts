import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function enhancedEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const valid = emailRegex.test(control.value);

    return valid ? null : { enhancedEmail: true };
  };
}
