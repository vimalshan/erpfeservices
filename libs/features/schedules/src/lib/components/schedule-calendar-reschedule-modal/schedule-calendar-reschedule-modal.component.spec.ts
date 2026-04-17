import { DatePipe } from '@angular/common';
import { DestroyRef, signal } from '@angular/core';
import { fakeAsync, flush } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

import {
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionStoreService,
} from '@customer-portal/data-access/schedules';

import { ScheduleCalendarRescheduleModalComponent } from './schedule-calendar-reschedule-modal.component';

describe('ScheduleCalendarRescheduleModalComponent', () => {
  let component: ScheduleCalendarRescheduleModalComponent;
  let mockDynamicDialogConfig: DynamicDialogConfig;
  let mockDatePipe: Partial<DatePipe>;
  let mockDestroyRef: Partial<DestroyRef>;
  let mockDynamicDialogRef: Partial<DynamicDialogRef>;
  let mockFormBuilder: Partial<FormBuilder>;
  let mockConfirmScheduleDetailsStoreService: Partial<ConfirmScheduleDetailsStoreService>;
  let mockScheduleCalendarActionStoreService: Partial<ScheduleCalendarActionStoreService>;
  let closeSubject: Subject<boolean>;

  beforeEach(() => {
    // Arrange
    closeSubject = new Subject<boolean>();
    mockDynamicDialogConfig = {
      data: { id: 111, location: 'rabbit' },
    };
    mockDatePipe = new DatePipe('en-US');
    mockDestroyRef = {
      onDestroy: jest.fn(),
    };
    mockDynamicDialogRef = {
      close: jest.fn(),
      onClose: closeSubject.asObservable(),
    };
    mockFormBuilder = new FormBuilder();
    mockConfirmScheduleDetailsStoreService = {
      calendarDetails: signal<any>({
        startDate: '01-01-2025',
      }),
      loadCalendarDetails: jest.fn(),
    };
    mockScheduleCalendarActionStoreService = {
      loadScheduleCalendarRescheduleReasons: jest.fn(),
      updateScheduleCalendarConfirm: jest.fn(),
      updateScheduleCalendarReschedule: jest.fn(),
    };

    component = new ScheduleCalendarRescheduleModalComponent(
      mockDynamicDialogConfig,
      mockDatePipe as DatePipe,
      mockDestroyRef as DestroyRef,
      mockDynamicDialogRef as DynamicDialogRef,
      mockFormBuilder as FormBuilder,
      mockConfirmScheduleDetailsStoreService as ConfirmScheduleDetailsStoreService,
      mockScheduleCalendarActionStoreService as ScheduleCalendarActionStoreService,
    );
  });

  test('should handle ngOnInit correctly', () => {
    // Arrange
    const spySetFormGroup = jest.spyOn(component, 'setFormGroup');
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
    expect(
      mockScheduleCalendarActionStoreService.loadScheduleCalendarRescheduleReasons,
    ).toHaveBeenCalled();
    expect(spySetFormGroup).toHaveBeenCalled();
    expect(spySetRefObs).toHaveBeenCalled();
  });

  test('should handle setFormGroup correctly', () => {
    // Act
    component.setFormGroup();

    // Arrange
    expect(component.form instanceof FormGroup).toBe(true);
    expect(component.form.controls['rescheduleDate']).toBeDefined();
    expect(component.form.controls['rescheduleReason']).toBeDefined();
    expect(component.form.controls['siteAuditId'].value).toBe(
      mockDynamicDialogConfig.data.id,
    );
  });

  test('should handle setRefObs correctly', fakeAsync(() => {
    // Arrange
    const spyOnSubmit = jest.spyOn(component, 'onSubmit');

    // Act
    component.ngOnInit();

    // Act
    closeSubject.next(true);
    flush();

    // Assert
    expect(spyOnSubmit).toHaveBeenCalled();
  }));

  test('should handle onSelectDate correctly', () => {
    // Arrange
    const date = new Date();
    const weekNumber = `${(mockDatePipe as DatePipe).transform(date, 'w')}/${new Date().getUTCFullYear()}`;

    // Act
    component.ngOnInit();
    component.onSelectDate(date);

    // Assert
    expect(component.form.controls['weekNumber'].value).toBe(weekNumber);
  });

  test('should handle onSubmit correctly', () => {
    // Act
    component.ngOnInit();

    // Arrange
    component.form.patchValue({
      additionalComments: 'Lots of Rabbits',
      rescheduleDate: new Date(),
      rescheduleReason: 'Rabbit Reason',
      siteAuditId: 111,
      weekNumber: '11/2025',
    });

    // Act
    component.onSubmit();

    // Assert
    expect(
      mockScheduleCalendarActionStoreService.updateScheduleCalendarReschedule,
    ).toHaveBeenCalledWith(
      'Lots of Rabbits',
      expect.any(Date),
      'Rabbit Reason',
      111,
      '11/2025',
    );
  });
});
