import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import {
  createSettingsCoBrowsingStoreServiceMock,
  isDnvUserMock,
} from '../__mocks__';
import { SettingsCoBrowsingStoreService } from '../state';
import { allowNonDnvUserGuard } from './allow-non-dnv-user.guard';

describe('allowNonDnvUserGuard', () => {
  let router: Router;

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      createUrlTree: jest.fn(() => ({})),
      navigateByUrl: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: SettingsCoBrowsingStoreService,
          useValue: settingsCoBrowsingStoreServiceMock,
        },
      ],
    });

    router = TestBed.inject(Router);
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  test('should allow navigation when user is NOT a DNV user', () => {
    // Arrange
    isDnvUserMock.set(false);

    TestBed.runInInjectionContext(() => {
      // Act
      const result = allowNonDnvUserGuard(route, state);

      // Assert
      expect(result).toBe(true);
      expect(router.createUrlTree).not.toHaveBeenCalled();
    });
  });

  test('should redirect to "" when user IS a DNV user', () => {
    // Arrange
    isDnvUserMock.set(true);

    const fakeUrlTree = {} as UrlTree;

    // Act

    TestBed.runInInjectionContext(() => {
      const result = allowNonDnvUserGuard(route, state);

      // Assert
      expect(router.createUrlTree).toHaveBeenCalledWith(['']);
      expect(result).toStrictEqual(fakeUrlTree);
    });
  });
});
