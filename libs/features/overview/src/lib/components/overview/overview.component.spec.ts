import {
  createOverviewStoreServiceMock,
  OverviewStoreService,
} from '@customer-portal/data-access/overview';
import {
  createProfileStoreServiceMock,
  ProfileStoreService,
} from '@customer-portal/data-access/settings';
import {
  createPagePermissionsServiceMock,
  PagePermissionsService,
} from '@customer-portal/permissions';
import {
  BreadcrumbService,
  CardNavigationPayload,
} from '@customer-portal/shared';

import { OverviewComponent } from './overview.component';

jest.mock('@angular/core', () => {
  const originalModule = jest.requireActual('@angular/core');

  return {
    ...originalModule,
    effect: jest.fn((callback) => callback()),
  };
});

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  const profileStoreServiceMock: Partial<ProfileStoreService> =
    createProfileStoreServiceMock();
  const overviewStoreServiceMock: Partial<OverviewStoreService> =
    createOverviewStoreServiceMock();
  const pagePermissionsServiceMock: Partial<PagePermissionsService> =
    createPagePermissionsServiceMock();
  let mockBreadcrumbService: jest.Mocked<BreadcrumbService>;

  beforeEach(async () => {
    mockBreadcrumbService = {
      setBreadcrumbVisibility: jest.fn(),
    } as any;
    component = new OverviewComponent(
      profileStoreServiceMock as ProfileStoreService,
      pagePermissionsServiceMock as PagePermissionsService,
      overviewStoreServiceMock as OverviewStoreService,
      mockBreadcrumbService as BreadcrumbService,
    );
  });

  test('should call loadOverviewCardData on component initialization', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(overviewStoreServiceMock.loadOverviewCardData).toHaveBeenCalled();
  });

  test('should call loadMoreOverviewCardData on requestMoreServiceCards method call', () => {
    // Act
    component.onRequestMoreServiceCards();

    // Assert
    expect(
      overviewStoreServiceMock.loadMoreOverviewCardData,
    ).toHaveBeenCalled();
  });

  test('should call resetOverviewCardData on component destruction', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(overviewStoreServiceMock.resetOverviewCardData).toHaveBeenCalled();
  });

  test('should call navigateFromOverviewCardToListView on onCardClicked method call', () => {
    // Arrange
    const payload: CardNavigationPayload = {
      entity: 'audit',
      service: 'ISO 9001:2015',
      year: '2025',
    };

    // Act
    component.onCardClicked(payload);

    // Assert
    expect(
      overviewStoreServiceMock.navigateFromOverviewCardToListView,
    ).toHaveBeenCalledWith(payload);
  });

  test('should compute userFirstName when first name exists', () => {
    // Act
    const name = component.userFirstName();

    // Assert
    expect(name).toBe(', John');
  });
});
