import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { UserTelemetryService } from '@customer-portal/core';
import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import {
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
  AuthTokenConstants,
  RouteConfig,
} from '@customer-portal/shared/constants';
import {
  AuthService,
  CoBrowsingSharedService,
} from '@customer-portal/shared/services';

import { UserValidationSubcodes } from '../constants';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  private userTelemetryService = inject(UserTelemetryService);

  constructor(
    public settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    private authService: AuthService,
    private settingsUserValidationService: SettingsUserValidationService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private profileStoreService: ProfileStoreService,
    private router: Router,
    private coBrowsingSharedService: CoBrowsingSharedService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
  ) {}

  initializePermissions = () => {
    if (window.history.state?.message) {
      window.history.replaceState(null, '');
    }

    return this.authService.isUserAuthenticatedWithExpiryInfo().pipe(
      tap(() => this.coBrowsingSharedService.setCoBrowsingUserEmail(null)),
      catchError(() => {
        this.router.navigate([RouteConfig.Error.path], {
          state: {
            message: 'fail',
            entityType: 'Authentication',
          },
        });

        return EMPTY;
      }),
      switchMap((auth) => {
        if (!auth.isUserAuthenticated) {
          if (this.authService.isLogOutInProgress()) {
            return of(true);
          }

          return from(this.router.navigateByUrl(AppPagesEnum.Welcome));
        }

        this.updateTokenExpiry(new Date(auth.expiryTimeUtc));

        return this.settingsUserValidationService.getUserValidation().pipe(
          catchError(() => {
            this.router.navigate([RouteConfig.Error.path], {
              state: {
                message: 'fail',
                entityType: 'User Validation',
              },
            });

            return EMPTY;
          }),
          switchMap((result) => {
            if (!result) {
              return EMPTY;
            }

            if (result.isDnvUser) {
              this.settingsCoBrowsingStoreService.updateIsDnvUser(true);

              return from(
                this.router.navigateByUrl(
                  AppPagesEnum.CoBrowsingCompanySelect,
                  {
                    state: { isUserValidated: true, isDnvUser: true },
                  },
                ),
              );
            }

            this.handleUserValidationActions(result);

            this.loadInitialData();

            return this.checkLoadedStates().pipe(
              switchMap(() => this.checkErrors()),
              switchMap((success) =>
                success ? this.loadApplicationData() : EMPTY,
              ),
            );
          }),
        );
      }),
    );
  };

  private loadInitialData(): void {
    this.profileStoreService.loadProfileData();
    this.globalSiteMasterStoreService.loadGlobalSiteMasterList();
    this.globalServiceMasterStoreService.loadGlobalServiceMasterList();
  }

  private checkLoadedStates(): Observable<boolean> {
    const loadedStates$ = {
      profileLoaded: this.profileStoreService.profileDataLoaded$,
      siteLoaded: this.globalSiteMasterStoreService.siteMasterLoaded$,
      serviceLoaded: this.globalServiceMasterStoreService.serviceMasterLoaded$,
    };

    return combineLatest(loadedStates$).pipe(
      filter(this.allStatesLoaded),
      take(1),
      map(() => true),
    );
  }

  private allStatesLoaded = (states: Record<string, boolean>): boolean =>
    Object.values(states).every((loaded) => loaded);

  private checkErrors(): Observable<boolean> {
    const errorStates$ = {
      profileError: this.profileStoreService.profileDataError$,
      languageError: this.profileLanguageStoreService.profileDataLanguageError$,
      companyError:
        this.settingsCompanyDetailsStoreService.companyDetailsError$,
      siteError: this.globalSiteMasterStoreService.siteMasterLoadingError$,
      serviceError:
        this.globalServiceMasterStoreService.serviceMasterLoadingError$,
    };

    return combineLatest(errorStates$).pipe(take(1), map(this.handleErrors));
  }

  private handleErrors = (errors: Record<string, any>): boolean => {
    const hasError = Object.values(errors).some((error) => error);

    if (hasError) {
      this.router.navigate([RouteConfig.Error.path], {
        state: { message: 'initialization' },
      });

      return false;
    }

    return true;
  };

  private loadApplicationData(): Observable<boolean> {
    return forkJoin({
      permissions: this.profileStoreService.profileInformationAccessLevel.pipe(
        filter(
          (accessLevel) => accessLevel && !!Object.keys(accessLevel).length,
        ),
        take(1),
      ),
      language: this.profileLanguageStoreService.profileLanguageLabel.pipe(
        filter((languageLabel) => languageLabel !== null),
        take(1),
      ),
    }).pipe(
      switchMap(() => this.userTelemetryService.initializeUserTracking()),
      map(() => true),
      catchError(() => {
        this.router.navigate([RouteConfig.Error.path]);

        return EMPTY;
      }),
    );
  }

  private handleUserValidationActions(result: UserValidation) {
    const {
      userIsActive,
      policySubCode,
      termsAcceptanceRedirectUrl,
      isAdmin,
      portalLanguage,
    } = result;

    if (this.hasNoValidSubscription(userIsActive, policySubCode)) {
      return from(
        this.router.navigateByUrl(AppPagesEnum.Welcome, {
          state: { isUserValidated: false },
        }),
      );
    }

    if (
      policySubCode === UserValidationSubcodes.TermsAndConditionsNotAccepted
    ) {
      const termsAcceptanceRedirectUpdatedUrl =
        termsAcceptanceRedirectUrl.replace(
          'redirect-url=',
          `redirect-url=${environment.baseUrl}`,
        );
      window.open(termsAcceptanceRedirectUpdatedUrl, '_self');

      return of({});
    }

    this.settingsCompanyDetailsStoreService.setCompanyDetailsAdminStatus(
      isAdmin,
    );
    this.profileLanguageStoreService.setProfileLanguage(portalLanguage);

    return of({});
  }

  private hasNoValidSubscription(
    userActive: boolean,
    policySubCode: number | null,
  ): boolean {
    return (
      !userActive ||
      policySubCode === UserValidationSubcodes.NoValidSubscription
    );
  }

  private updateTokenExpiry(newExpiryDate: Date): void {
    const existingExpiry = localStorage.getItem(
      AuthTokenConstants.TOKEN_EXPIRY_KEY,
    );

    if (!existingExpiry) {
      this.storeNewExpiry(newExpiryDate);

      return;
    }

    const existingExpiryDate = new Date(existingExpiry);
    this.storeLatestExpiry(existingExpiryDate, newExpiryDate);
  }

  private storeNewExpiry(expiryDate: Date): void {
    this.authService.storeTokenData(expiryDate.toISOString());
  }

  private storeLatestExpiry(existingDate: Date, newDate: Date): void {
    if (newDate > existingDate) {
      this.storeNewExpiry(newDate);
    } else {
      const existingDuration = localStorage.getItem(
        AuthTokenConstants.TOKEN_DURATION_KEY,
      );

      if (existingDuration) {
        localStorage.setItem(
          AuthTokenConstants.TOKEN_DURATION_KEY,
          existingDuration,
        );
      }
    }
  }
}
