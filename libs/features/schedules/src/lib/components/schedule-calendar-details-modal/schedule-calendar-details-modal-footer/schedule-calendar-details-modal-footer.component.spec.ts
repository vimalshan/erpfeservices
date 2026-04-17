import { signal } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  CalendarDetailsModel,
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionTypes,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';

import { ScheduleCalendarDetailsModalFooterComponent } from './schedule-calendar-details-modal-footer.component';

describe('ScheduleCalendarDetailsModalFooterComponent', () => {
  const mockConfirmScheduleDetailsStoreService: Partial<ConfirmScheduleDetailsStoreService> =
    {
      calendarDetails: signal({
        status: ScheduleStatus.ToBeConfirmed,
      } as CalendarDetailsModel),
    };
  const mockDynamicDialogRef: Partial<DynamicDialogRef> = {
    close: jest.fn(),
  };
  let component: ScheduleCalendarDetailsModalFooterComponent;

  beforeEach(() => {
    // Arrange
    component = new ScheduleCalendarDetailsModalFooterComponent(
      mockConfirmScheduleDetailsStoreService as ConfirmScheduleDetailsStoreService,
      mockDynamicDialogRef as DynamicDialogRef,
    );
  });

  test('should compute isConfirmVisible correctly', () => {
    // Assert
    expect(component.isConfirmVisible()).toBe(true);
  });

  test('should compute isRescheduleVisible correctly', () => {
    // Assert
    expect(component.isRescheduleVisible()).toBe(true);
  });

  test('should handle onConfirm correctly', () => {
    // Act
    component.onConfirm();

    // Assert
    expect(mockDynamicDialogRef.close).toHaveBeenCalledWith(
      ScheduleCalendarActionTypes.Confirm,
    );
  });

  test('should handle onReschedule correctly', () => {
    // Act
    component.onReschedule();

    // Assert
    expect(mockDynamicDialogRef.close).toHaveBeenCalledWith(
      ScheduleCalendarActionTypes.Reschedule,
    );
  });
});
