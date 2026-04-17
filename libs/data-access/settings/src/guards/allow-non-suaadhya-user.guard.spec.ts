import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import {
  createSettingsCoBrowsingStoreServiceMock,
  isSuaadhyaUserMock,
} from '../__mocks__';
import { SettingsCoBrowsingStoreService } from '../state';
import { allowNonSuaadhyaUserGuard } from './allow-non-suaadhya-user.guard';

describe('allowNonSuaadhyaUserGuard', () => {
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

  test('should allow navigation when user is NOT a Suaadhya user', () => {
    // Arrange
    isSuaadhyaUserMock.set(false);

    TestBed.runInInjectionContext(() => {
      // Act
      const result = allowNonSuaadhyaUserGuard(route, state);

      // Assert
      expect(result).toBe(true);
      expect(router.createUrlTree).not.toHaveBeenCalled();
    });
  });

  test('should redirect to "" when user IS a Suaadhya user', () => {
    // Arrange
    isSuaadhyaUserMock.set(true);

    const fakeUrlTree = {} as UrlTree;

    // Act

    TestBed.runInInjectionContext(() => {
      const result = allowNonSuaadhyaUserGuard(route, state);

      // Assert
      expect(router.createUrlTree).toHaveBeenCalledWith(['']);
      expect(result).toStrictEqual(fakeUrlTree);
    });
  });
});
