import { ConfirmationService } from 'primeng/api';

import { SpinnerService } from '@customer-portal/core';
import {
  createFindingDetailsStoreServiceMock,
  FindingDetailsStoreService,
} from '@customer-portal/data-access/findings';

import { FindingDetailsComponent } from './finding-details.component';

describe('FindingDetailsComponent', () => {
  let component: FindingDetailsComponent;
  const findingsDetailsStoreServiceMock: Partial<FindingDetailsStoreService> =
    createFindingDetailsStoreServiceMock();

  jest.mock('primeng/api', () => ({
    ConfirmationService: jest.fn().mockImplementation(() => ({
      confirm: jest.fn(),
    })),
  }));

  const spinnerServiceMock: Partial<SpinnerService> = {
    setLoading: jest.fn(),
  };

  const mockedConfirmationService: Partial<ConfirmationService> = {
    confirm: jest.fn(),
  };

  beforeEach(async () => {
    component = new FindingDetailsComponent(
      findingsDetailsStoreServiceMock as FindingDetailsStoreService,
      mockedConfirmationService as ConfirmationService,
      spinnerServiceMock as SpinnerService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call loadFindingDetails on init if findingId exists', () => {
    // Arrange
    const loadFindingDetailsSpy = jest.spyOn(
      findingsDetailsStoreServiceMock,
      'loadFindingDetails',
    );

    // Assert
    expect(loadFindingDetailsSpy).toHaveBeenCalled();
  });

  test('should return findingId from findingParams', () => {
    // Assert
    expect(component.findingId).toBe('finding-id');
  });

  test('should reset finding details state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      findingsDetailsStoreServiceMock.resetFindingDetailsState,
    ).toHaveBeenCalled();
  });
});
