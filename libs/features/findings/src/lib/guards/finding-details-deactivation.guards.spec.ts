import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { Observable, of } from 'rxjs';

import { SpinnerService } from '@customer-portal/core';
import {
  createFindingDetailsStoreServiceMock,
  FindingDetailsStoreService,
} from '@customer-portal/data-access/findings';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { FindingDetailsComponent } from '../components';
import { findingDetailsDeactivationGuard } from './finding-details-deactivation.guard';

class MockFindingDetailsComponent {
  isFindingResponseFormDirty$ = of(false);
  confirmationService = {
    confirm: jest.fn(),
  };
}

describe('findingDetailsDeactivationGuard', () => {
  const findingsDetailsStoreServiceMock: Partial<FindingDetailsStoreService> =
    createFindingDetailsStoreServiceMock();

  const mockedConfirmationService: Partial<ConfirmationService> = {
    confirm: jest.fn(),
  };

  const spinnerServiceMock: Partial<SpinnerService> = {
    setLoading: jest.fn(),
  };

  const currentRoute = {} as ActivatedRouteSnapshot;
  const currentState = {} as RouterStateSnapshot;
  const nextState = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: TranslocoService, useValue: createTranslationServiceMock() },
        {
          provide: FindingDetailsStoreService,
          useValue: findingsDetailsStoreServiceMock,
        },
        {
          provide: FindingDetailsComponent,
          useClass: MockFindingDetailsComponent,
        },
      ],
    });
  });

  test('should allow deactivation when form is not dirty', (done) => {
    // Arrange
    const component = new FindingDetailsComponent(
      findingsDetailsStoreServiceMock as FindingDetailsStoreService,
      mockedConfirmationService as ConfirmationService,
      spinnerServiceMock as SpinnerService,
    );
    component.isFindingResponseFormDirty$ = of(false);

    TestBed.runInInjectionContext(() => {
      // Act
      (
        findingDetailsDeactivationGuard(
          component,
          currentRoute,
          currentState,
          nextState,
        ) as Observable<boolean>
      ).subscribe((result) => {
        // Assert
        expect(result).toBe(true);
        done();
      });
    });
  });

  test('should show confirmation and prevent deactivation when form is dirty and user accepts (continue editing)', (done) => {
    // Arrange
    const component = new FindingDetailsComponent(
      findingsDetailsStoreServiceMock as FindingDetailsStoreService,
      mockedConfirmationService as ConfirmationService,
      spinnerServiceMock as SpinnerService,
    );
    component.isFindingResponseFormDirty$ = of(true);

    jest
      .spyOn(mockedConfirmationService, 'confirm')
      .mockImplementation((options: any): any => {
        options.accept();
      });

    TestBed.runInInjectionContext(() => {
      // Act
      (
        findingDetailsDeactivationGuard(
          component,
          currentRoute,
          currentState,
          nextState,
        ) as Observable<boolean>
      ).subscribe((result) => {
        // Assert
        expect(result).toBe(false);
        done();
      });
    });
  });

  test('should allow deactivation when form is dirty and user rejects (discard)', (done) => {
    // Arrange
    const component = new FindingDetailsComponent(
      findingsDetailsStoreServiceMock as FindingDetailsStoreService,
      mockedConfirmationService as ConfirmationService,
      spinnerServiceMock as SpinnerService,
    );
    component.isFindingResponseFormDirty$ = of(true);

    jest
      .spyOn(mockedConfirmationService, 'confirm')
      .mockImplementation((options: any): any => {
        options.reject();
      });

    TestBed.runInInjectionContext(() => {
      // Act
      (
        findingDetailsDeactivationGuard(
          component,
          currentRoute,
          currentState,
          nextState,
        ) as Observable<boolean>
      ).subscribe((result) => {
        // Assert
        expect(result).toBe(true);
        done();
      });
    });
  });
});
