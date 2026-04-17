import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { ValidateUserDto } from '../../dtos';
import { SETTINGS_USER_VALIDATION_QUERY } from '../../graphql';
import { SettingsUserValidationService } from './settings-user-validation.service';

describe('SettingsUserValidationService', () => {
  let service: SettingsUserValidationService;
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    service = new SettingsUserValidationService(apolloMock as Apollo);
  });

  test('should call getUserValidation', (done) => {
    // Arrange
    const mockedValidateUser: ValidateUserDto = {
      userIsActive: true,
      policySubCode: 3,
      termsAcceptanceRedirectUrl: 'https://example.com?redirect-url=',
    };

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          validateUser: {
            data: mockedValidateUser,
          },
        },
      }),
    );

    // Act
    service.getUserValidation().subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: SETTINGS_USER_VALIDATION_QUERY,
        fetchPolicy: 'no-cache',
      });
      expect(result).toBe(mockedValidateUser);
      done();
    });
  });
});
