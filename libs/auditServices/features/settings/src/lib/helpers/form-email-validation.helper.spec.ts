import { FormControl } from '@angular/forms';

import { enhancedEmailValidator } from './form-email-validation.helper';

describe('enhancedEmailValidator', () => {
  test('should return null for a valid email', () => {
    // Arrange
    const control = new FormControl('test@test.com');
    const validator = enhancedEmailValidator();

    // Act
    const result = validator(control);

    // Assert
    expect(result).toBeNull();
  });

  test('should return an error object for an invalid email', () => {
    // Arrange
    const control = new FormControl('invalid-email');
    const validator = enhancedEmailValidator();

    // Act
    const result = validator(control);

    // Assert
    expect(result).toEqual({ enhancedEmail: true });
  });

  test('should return an error object for an empty email', () => {
    // Arrange
    const control = new FormControl('');
    const validator = enhancedEmailValidator();

    // Act
    const result = validator(control);

    // Assert
    expect(result).toEqual({ enhancedEmail: true });
  });
});
