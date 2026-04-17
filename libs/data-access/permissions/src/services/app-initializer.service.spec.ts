import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { UserTelemetryService } from '@customer-portal/core';
import {
  createProfileLanguageStoreServiceMock,
  createProfileStoreServiceMock,
  ProfileLanguageStoreService,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
  SettingsUserValidationService,
  UserValidation,
} from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import {
  AppPagesEnum,
  AuthService,
  AuthServiceResponse,
  createAuthServiceMock,
} from '@customer-portal/shared';

import { UserValidationSubcodes } from '../constants';
import { AppInitializerService } from './app-initializer.service';

describe('AppInitializerService', () => {
  let service: AppInitializerService;
  let authServiceMock: jest.Mocked<AuthService>;
  let profileStoreServiceMock: jest.Mocked<ProfileStoreService>;
  let profileLanguageStoreServiceMock: jest.Mocked<ProfileLanguageStoreService>;
  let settingsUserValidationServiceMock: jest.Mocked<SettingsUserValidationService>;
  let settingsCompanyDetailsStoreServiceMock: jest.Mocked<SettingsCompanyDetailsStoreService>;
  let userTelemetryServiceMock: jest.Mocked<UserTelemetryService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    const currentDate = new Date();
    authServiceMock = {
      ...createAuthServiceMock(),
      isUserAuthenticatedWithExpiryInfo: jest.fn().mockReturnValue(
        of({
          isUserAuthenticated: false,
          expiryTimeUtc: currentDate,
        } as AuthServiceResponse),
      ),
      storeTokenData: jest.fn(),
    } as any;

    profileStoreServiceMock = {
      ...createProfileStoreServiceMock(),
      profileInformationAccessLevel: of({ someAccess: true }),
      loadProfileData: jest.fn(),
      setInitialLoginStatus: jest.fn(),
    } as any;

    profileLanguageStoreServiceMock = {
      ...createProfileLanguageStoreServiceMock(),
      profileLanguageLabel: of('en'),
      loadProfileLanguage: jest.fn(),
    } as any;

    settingsUserValidationServiceMock = {
      getUserValidation: jest.fn(),
    } as any;

    settingsCompanyDetailsStoreServiceMock = {
      loadSettingsCompanyDetails: jest.fn(),
      companyDetailsLoaded$: of(true),
    } as any;

    userTelemetryServiceMock = {
      initializeUserTracking: jest.fn(),
    } as any;

    routerMock = {
      createUrlTree: jest.fn(),
      navigateByUrl: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProfileStoreService, useValue: profileStoreServiceMock },
        {
          provide: ProfileLanguageStoreService,
          useValue: profileLanguageStoreServiceMock,
        },
        {
          provide: SettingsUserValidationService,
          useValue: settingsUserValidationServiceMock,
        },
        {
          provide: SettingsCompanyDetailsStoreService,
          useValue: settingsCompanyDetailsStoreServiceMock,
        },
        {
          provide: SettingsCoBrowsingStoreService,
          useValue: { updateIsDnvUser: jest.fn() },
        },

        {
          provide: UserTelemetryService,
          useValue: userTelemetryServiceMock,
        },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AppInitializerService);
  });
  test('should redirect unauthenticated users', (done) => {
    // Arrange
    const mockedRedirectConfig = {
      url: AppPagesEnum.Welcome,
    };
    authServiceMock.isUserAuthenticatedWithExpiryInfo.mockReturnValue(
      of({
        isUserAuthenticated: false,
        expiryTimeUtc: new Date(),
      } as AuthServiceResponse),
    );
    routerMock.navigateByUrl.mockImplementation(() => Promise.resolve(true));

    // Act
    service.initializePermissions().subscribe({
      complete: () => {
        // Assert
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
          mockedRedirectConfig.url,
        );
        expect(profileStoreServiceMock.loadProfileData).not.toHaveBeenCalled();
        expect(
          profileLanguageStoreServiceMock.loadProfileLanguage,
        ).not.toHaveBeenCalled();
        done();
      },
    });
  });
  test('should initialize permissions and set language successfully when user is authenticated and validated', (done) => {
    // Arrange
    const mockedResult: UserValidation = {
      userIsActive: true,
      policySubCode: null,
      termsAcceptanceRedirectUrl: '',
    };

    const currentDate = new Date();
    authServiceMock.isUserAuthenticatedWithExpiryInfo.mockReturnValue(
      of({
        isUserAuthenticated: true,
        expiryTimeUtc: currentDate,
      } as AuthServiceResponse),
    );

    settingsUserValidationServiceMock.getUserValidation.mockReturnValue(
      of(mockedResult),
    );

    userTelemetryServiceMock.initializeUserTracking.mockReturnValue(of(true));

    // Act
    service.initializePermissions().subscribe({
      next: (result) => {
        // Assert
        expect(result).toBe(true);
        expect(authServiceMock.storeTokenData).toHaveBeenCalled();
        expect(profileStoreServiceMock.loadProfileData).toHaveBeenCalled();
        expect(
          profileLanguageStoreServiceMock.loadProfileLanguage,
        ).toHaveBeenCalled();
        expect(
          userTelemetryServiceMock.initializeUserTracking,
        ).toHaveBeenCalled();
        done();
      },
      error: (error) => {
        fail(`Should not have errored: ${error}`);
        done();
      },
    });
  });
  test('should set initial login status to false when user is authenticated and validated', (done) => {
    // Arrange
    const mockedInitialLoginStatus = false;
    const mockedResult: UserValidation = {
      userIsActive: true,
      policySubCode: null,
      termsAcceptanceRedirectUrl: '',
    };
    authServiceMock.isUserAuthenticatedWithExpiryInfo.mockReturnValue(
      of({
        isUserAuthenticated: true,
        expiryTimeUtc: new Date(),
      } as AuthServiceResponse),
    );
    settingsUserValidationServiceMock.getUserValidation.mockReturnValue(
      of(mockedResult),
    );
    userTelemetryServiceMock.initializeUserTracking.mockReturnValue(of(true));

    // Act
    service.initializePermissions().subscribe(() => {
      // Assert
      expect(
        profileStoreServiceMock.setInitialLoginStatus,
      ).toHaveBeenCalledWith(mockedInitialLoginStatus);
      done();
    });
  });
  test('should handle error during initialization', (done) => {
    // Arrange
    const mockedResult: UserValidation = {
      userIsActive: true,
      policySubCode: null,
      termsAcceptanceRedirectUrl: '',
    };

    const currentDate = new Date();
    authServiceMock.isUserAuthenticatedWithExpiryInfo.mockReturnValue(
      of({
        isUserAuthenticated: true,
        expiryTimeUtc: currentDate,
      } as AuthServiceResponse),
    );

    settingsUserValidationServiceMock.getUserValidation.mockReturnValue(
      of(mockedResult),
    );

    const error = new Error('Telemetry initialization failed');
    userTelemetryServiceMock.initializeUserTracking.mockReturnValue(
      throwError(() => error),
    );

    // Act
    service.initializePermissions().subscribe({
      next: () => {
        fail('Should have thrown an error');
        done();
      },
      error: (err) => {
        expect(err).toBe(error);
        done();
      },
      complete: () => {
        fail('Observable should not complete');
        done();
      },
    });
  });

  describe('handleUserValidationActions', () => {
    test('should navigate to welcome page when user has no valid subscription', (done) => {
      // Arrange
      const mockedResult: UserValidation = {
        userIsActive: false,
        policySubCode: null,
        termsAcceptanceRedirectUrl: '',
      };
      const mockedRedirectConfig = {
        url: AppPagesEnum.Welcome,
        extras: { state: { isUserValidated: false } },
      };
      routerMock.navigateByUrl.mockResolvedValue(true);

      // Act
      service['handleUserValidationActions'](mockedResult).subscribe(() => {
        // Assert
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
          mockedRedirectConfig.url,
          mockedRedirectConfig.extras,
        );
        done();
      });
    });

    test('should open terms acceptance page when user has not accepted terms and conditions', (done) => {
      // Arrange
      const mockedResult: UserValidation = {
        userIsActive: true,
        policySubCode: UserValidationSubcodes.TermsAndConditionsNotAccepted,
        termsAcceptanceRedirectUrl: 'https://example.com?redirect-url=',
      };
      const expectedUrl = `https://example.com?redirect-url=${environment.baseUrl}`;
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();

      // Act
      service['handleUserValidationActions'](mockedResult).subscribe(() => {
        // Assert
        expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_self');
        expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
        done();

        // Cleanup
        windowOpenSpy.mockRestore();
      });
    });

    test('should return an observable of an empty object when user is active and policySubCode is incorrect or does not exist', (done) => {
      // Arrange
      const mockedResult: UserValidation = {
        userIsActive: true,
        policySubCode: 5,
        termsAcceptanceRedirectUrl: '',
      };

      // Act
      service['handleUserValidationActions'](mockedResult).subscribe(
        (result) => {
          // Assert
          expect(result).toEqual({});
          expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
          done();
        },
      );
    });
  });

  describe('hasNoValidSubscription', () => {
    test('should return true when user is inactive', () => {
      expect(service['hasNoValidSubscription'](false, null)).toBe(true);
    });

    test('should return true when user has no valid subscription', () => {
      expect(
        service['hasNoValidSubscription'](
          true,
          UserValidationSubcodes.NoValidSubscription,
        ),
      ).toBe(true);
    });

    test('should return false when user is active and policySubCode is incorrect or does not exist', () => {
      expect(service['hasNoValidSubscription'](true, 5)).toBe(false);
    });
  });
});
