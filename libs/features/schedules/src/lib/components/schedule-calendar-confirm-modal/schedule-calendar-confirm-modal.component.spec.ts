import { DestroyRef } from '@angular/core';
import { fakeAsync, flush } from '@angular/core/testing';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

import {
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionStoreService,
} from '@customer-portal/data-access/schedules';

import { ScheduleCalendarConfirmModalComponent } from './schedule-calendar-confirm-modal.component';

describe('ScheduleCalendarConfirmModalComponent', () => {
  let component: ScheduleCalendarConfirmModalComponent;
  let mockDynamicDialogConfig: DynamicDialogConfig;
  let mockDestroyRef: Partial<DestroyRef>;
  let mockDynamicDialogRef: Partial<DynamicDialogRef>;
  let mockScheduleCalendarActionStoreService: Partial<ScheduleCalendarActionStoreService>;
  let mockConfirmScheduleDetailsStoreService: Partial<ConfirmScheduleDetailsStoreService>;
  let closeSubject: Subject<boolean>;

  beforeEach(() => {
    // Arrange
    closeSubject = new Subject<boolean>();
    mockDynamicDialogConfig = {
      data: { id: 111, location: 'rabbit' },
    };
    mockDestroyRef = {
      onDestroy: jest.fn(),
    };
    mockDynamicDialogRef = {
      close: jest.fn(),
      onClose: closeSubject.asObservable(),
    };
    mockScheduleCalendarActionStoreService = {
      updateScheduleCalendarConfirm: jest.fn(),
    };
    mockConfirmScheduleDetailsStoreService = {
      loadCalendarDetails: jest.fn(),
    };

    component = new ScheduleCalendarConfirmModalComponent(
      mockDynamicDialogConfig,
      mockDestroyRef as DestroyRef,
      mockDynamicDialogRef as DynamicDialogRef,
      mockScheduleCalendarActionStoreService as ScheduleCalendarActionStoreService,
      mockConfirmScheduleDetailsStoreService as ConfirmScheduleDetailsStoreService,
    );
  });

  test('should handle ngOnInit correctly', () => {
    // Arrange
    const spySetRefObs = jest.spyOn(component, 'setRefObs');

    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockConfirmScheduleDetailsStoreService.loadCalendarDetails,
    ).toHaveBeenCalledWith(
      mockDynamicDialogConfig.data.id,
      mockDynamicDialogConfig.data.location,
    );
    expect(spySetRefObs).toHaveBeenCalled();
  });

  test('should handle setRefObs correctly', fakeAsync(() => {
    // Arrange
    const spyOnConfirm = jest.spyOn(component, 'onConfirm');

    // Act
    component.setRefObs();

    // Act
    closeSubject.next(true);
    flush();

    // Assert
    expect(spyOnConfirm).toHaveBeenCalled();
  }));

  test('should handle onConfirm correctly', () => {
    // Act
    component.onConfirm();

    // Assert
    expect(
      mockScheduleCalendarActionStoreService.updateScheduleCalendarConfirm,
    ).toHaveBeenCalledWith(mockDynamicDialogConfig.data.id);
  });
});
