import { DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { SessionTimeoutService } from '@customer-portal/core';
import {
  AuthService,
  AuthTokenConstants,
  BreadcrumbService,
  CoBrowsingSharedService,
  ScriptLoaderService,
} from '@customer-portal/shared';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockCoBrowsingSharedService: CoBrowsingSharedService;
  let mockScriptLoaderService: ScriptLoaderService;
  let mockSessionTimeoutService: SessionTimeoutService;
  let mockBreadcrumbService: BreadcrumbService;
  let mockAuthService: AuthService;
  let mockRouter: Router;
  let mockDestroyRef: DestroyRef;
  let breadcrumbVisibilitySubject: Subject<boolean>;

  beforeEach(() => {
    mockCoBrowsingSharedService = {} as any;
    mockScriptLoaderService = {
      loadServiceNowScript: jest.fn(),
    } as any;
    mockSessionTimeoutService = {
      initialize: jest.fn(),
    } as any;
    mockAuthService = {
      clearTokenData: jest.fn(),
    } as any;
    breadcrumbVisibilitySubject = new Subject<boolean>();
    mockBreadcrumbService = {
      breadcrumbVisibility$: breadcrumbVisibilitySubject.asObservable(),
    } as any;
    mockRouter = {
      url: '/home',
    } as any;
    mockDestroyRef = {} as any;

    component = new AppComponent(
      mockCoBrowsingSharedService,
      mockScriptLoaderService,
      mockSessionTimeoutService,
      mockAuthService,
      mockRouter,
      mockBreadcrumbService,
      mockDestroyRef
    );
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should update breadcrumbVisibility when breadcrumbService emits a value', () => {
    breadcrumbVisibilitySubject.next(true);
    expect(component.breadcrumbVisibility).toBe(true);
  });

  test('should initialize title as "customer-portal"', () => {
    expect(component.title).toBe('customer-portal');
  });

  test('should initialize script loader and session timeout service when token is valid', () => {
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour in the future
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(expiryDate.toISOString());

    component.ngOnInit();

    expect(mockScriptLoaderService.loadServiceNowScript).toHaveBeenCalled();
    expect(getItemSpy).toHaveBeenCalledWith(
      AuthTokenConstants.TOKEN_EXPIRY_KEY
    );
    expect(mockSessionTimeoutService.initialize).toHaveBeenCalledWith(
      expiryDate
    );
    expect(component.isLoggedIn).toBe(true);

    getItemSpy.mockRestore();
  });

  test('should not set isLoggedIn when token is expired', () => {
    const expiryDate = new Date(Date.now() - 3600000); // 1 hour in the past
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(expiryDate.toISOString());

    component.ngOnInit();

    expect(component.isLoggedIn).toBe(false);
    getItemSpy.mockRestore();
  });

  test('should not set isLoggedIn when no token exists', () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(null);

    component.ngOnInit();

    expect(component.isLoggedIn).toBe(false);
    getItemSpy.mockRestore();
  });
});