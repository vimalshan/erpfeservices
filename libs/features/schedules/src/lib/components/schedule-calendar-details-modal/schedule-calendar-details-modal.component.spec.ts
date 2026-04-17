import { signal, WritableSignal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import {
  CalendarDetailsModel,
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionLocationTypes,
  ScheduleCalendarActionStoreService,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';

import { ScheduleCalendarDetailsModalComponent } from './schedule-calendar-details-modal.component';

describe('ScheduleCalendarDetailsModalComponent', () => {
  let component: ScheduleCalendarDetailsModalComponent;
  let mockDynamicDialogConfig: DynamicDialogConfig;
  let mockScheduleCalendarActionStoreService: Partial<ScheduleCalendarActionStoreService>;
  let mockConfirmScheduleDetailsStoreService: Partial<ConfirmScheduleDetailsStoreService>;

  beforeEach(() => {
    // Arrange
    mockDynamicDialogConfig = {
      data: { id: 111 },
    };
    mockScheduleCalendarActionStoreService = {
      loadScheduleCalendarAddToCalendar: jest.fn(),
      loadScheduleCalendarShareInvite: jest.fn(),
    };
    const calendarDetails = signal({
      scheduleId: 123,
      startDate: '2025-03-14T12:00:00Z',
      endDate: '2025-03-15T12:00:00Z',
      status: '',
      service: 'Audit Service',
      auditType: 'Internal',
      auditor: 'John Doe',
      site: 'HQ Office',
      address: '123 Business Street',
      siteRepresentative: 'Jane Smith',
      shareInvite: true,
    });
    mockConfirmScheduleDetailsStoreService = {
      loadCalendarDetails: jest.fn(),
      calendarDetails,
    };

    component = new ScheduleCalendarDetailsModalComponent(
      mockDynamicDialogConfig,
      mockScheduleCalendarActionStoreService as ScheduleCalendarActionStoreService,
      mockConfirmScheduleDetailsStoreService as ConfirmScheduleDetailsStoreService,
    );
  });

  describe('isToBeConfirmedStatus compute', () => {
    let calendarDetails: WritableSignal<CalendarDetailsModel>;

    beforeEach(() => {
      // Arrange
      calendarDetails =
        mockConfirmScheduleDetailsStoreService.calendarDetails! as WritableSignal<CalendarDetailsModel>;
    });

    test('should return true when status is "ToBeConfirmedByDnv"', () => {
      // Act
      calendarDetails!.set({
        ...calendarDetails(),
        status: ScheduleStatus.ToBeConfirmedByDnv,
      });

      // Assert
      expect(component.isToBeConfirmedStatus()).toBe(true);
    });

    test('should return false when status is not "ToBeConfirmedByDnv"', () => {
      // Act
      calendarDetails.set({
        ...calendarDetails(),
        status: ScheduleStatus.Confirmed,
      });

      // Assert
      expect(component.isToBeConfirmedStatus()).toBe(false);
    });

    test('should handle case-insensitive comparison', () => {
      // Act
      calendarDetails.set({
        ...calendarDetails(),
        status: ScheduleStatus.ToBeConfirmedByDnv.toUpperCase(),
      });

      // Assert
      expect(component.isToBeConfirmedStatus()).toBe(true);
    });
  });

  test('should handle ngOnInit correctly', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockConfirmScheduleDetailsStoreService.loadCalendarDetails,
    ).toHaveBeenCalledWith(
      mockDynamicDialogConfig.data.id,
      ScheduleCalendarActionLocationTypes.Calendar,
    );
  });

  test('should handle onAddToCalendar correctly', () => {
    // Act
    component.onAddToCalendar();

    // Assert
    expect(
      mockScheduleCalendarActionStoreService.loadScheduleCalendarAddToCalendar,
    ).toHaveBeenCalledWith(mockDynamicDialogConfig.data.id);
  });

  test('should handle onShareInvite correctly', () => {
    // Act
    component.onShareInvite();

    // Assert
    expect(
      mockScheduleCalendarActionStoreService.loadScheduleCalendarShareInvite,
    ).toHaveBeenCalledWith(mockDynamicDialogConfig.data.id);
  });
});
