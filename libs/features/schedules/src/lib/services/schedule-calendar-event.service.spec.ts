import { signal } from '@angular/core';
import { fakeAsync, flush } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject } from 'rxjs';

import {
  ScheduleCalendarActionLocationTypes,
  ScheduleCalendarActionTypes,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';
import {
  createProfileStoreServiceMock,
  ProfileStoreService,
} from '@customer-portal/data-access/settings';

import {
  ScheduleCalendarConfirmModalComponent,
  ScheduleCalendarConfirmModalFooterComponent,
} from '../components/schedule-calendar-confirm-modal';
import {
  ScheduleCalendarDetailsModalComponent,
  ScheduleCalendarDetailsModalFooterComponent,
} from '../components/schedule-calendar-details-modal';
import {
  ScheduleCalendarRescheduleModalComponent,
  ScheduleCalendarRescheduleModalFooterComponent,
} from '../components/schedule-calendar-reschedule-modal';
import { ScheduleCalendarEventService } from './schedule-calendar-event.service';

describe('ScheduleCalendarEventService', () => {
  let service: ScheduleCalendarEventService;
  let mockProfileStoreService: Partial<ProfileStoreService>;
  let mockDialogService: Partial<DialogService>;
  let mockTranslocoService: Partial<TranslocoService>;
  let mockDynamicDialogRef: Partial<DynamicDialogRef>;
  let closeSubject: Subject<ScheduleCalendarActionTypes>;

  beforeEach(() => {
    // Arrange
    closeSubject = new Subject<ScheduleCalendarActionTypes>();
    mockProfileStoreService = createProfileStoreServiceMock();
    mockDynamicDialogRef = {
      close: jest.fn(),
      onClose: closeSubject.asObservable(),
    };
    mockDialogService = {
      open: jest.fn().mockReturnValue(mockDynamicDialogRef),
    };
    mockTranslocoService = {
      translate: jest.fn((key) => key),
    } as any;

    service = new ScheduleCalendarEventService(
      mockProfileStoreService as ProfileStoreService,
      mockDialogService as DialogService,
      mockTranslocoService as TranslocoService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle onOpenDetailsModal correctly', () => {
    // Arrange
    const id = 111;
    const status = ScheduleStatus.Confirmed;
    const date = '2030-01-01T00:00:00Z';
    jest
      .spyOn(mockProfileStoreService, 'hasPermission')
      .mockReturnValue(signal(true));

    // Act
    service.onOpenDetailsModal(id, status, date);

    // Assert
    expect(mockDialogService.open).toHaveBeenCalledWith(
      ScheduleCalendarDetailsModalComponent,
      {
        width: '50vw',
        contentStyle: { overflow: 'auto', padding: '0' },
        breakpoints: expect.any(Object),
        focusOnShow: false,
        header: expect.any(String),
        baseZIndex: 10000,
        data: { id },
        templates: {
          footer: ScheduleCalendarDetailsModalFooterComponent,
        },
      },
    );
  });

  test('should handle onOpenDetailsModal and Reschedule correctly', fakeAsync(() => {
    // Arrange
    const id = 111;
    const status = ScheduleStatus.Confirmed;
    const date = '2030-01-01T00:00:00Z';
    const spyOnOpenRescheduleModal = jest.spyOn(
      service,
      'onOpenRescheduleModal',
    );
    jest
      .spyOn(mockProfileStoreService, 'hasPermission')
      .mockReturnValue(signal(true));

    // Act
    service.onOpenDetailsModal(id, status, date);

    // Act
    closeSubject.next(ScheduleCalendarActionTypes.Reschedule);
    flush();

    // Assert
    expect(spyOnOpenRescheduleModal).toHaveBeenCalledWith(
      id,
      ScheduleCalendarActionLocationTypes.Calendar,
    );
  }));

  test('should handle onOpenDetailsModal and Confirm correctly', fakeAsync(() => {
    // Arrange
    const id = 111;
    const status = ScheduleStatus.Confirmed;
    const date = '2030-01-01T00:00:00Z';
    const spyOnOpenConfirmModal = jest.spyOn(service, 'onOpenConfirmModal');
    jest
      .spyOn(mockProfileStoreService, 'hasPermission')
      .mockReturnValue(signal(true));

    // Act
    service.onOpenDetailsModal(id, status, date);

    // Act
    closeSubject.next(ScheduleCalendarActionTypes.Confirm);
    flush();

    // Assert
    expect(spyOnOpenConfirmModal).toHaveBeenCalledWith(
      id,
      ScheduleCalendarActionLocationTypes.Calendar,
    );
  }));

  test('should handle onOpenRescheduleModal correctly', () => {
    // Arrange
    const id = 111;
    const location = ScheduleCalendarActionLocationTypes.Calendar;
    const formValid = new BehaviorSubject<boolean>(false);

    // Act
    service.onOpenRescheduleModal(id, location);

    // Assert
    expect(mockDialogService.open).toHaveBeenCalledWith(
      ScheduleCalendarRescheduleModalComponent,
      {
        width: '50vw',
        contentStyle: { overflow: 'auto', padding: '0' },
        breakpoints: expect.any(Object),
        focusOnShow: false,
        header: expect.any(String),
        data: { formValid, id, location },
        baseZIndex: 10000,
        templates: {
          footer: ScheduleCalendarRescheduleModalFooterComponent,
        },
      },
    );
  });

  test('should handle onOpenConfirmModal correctly', () => {
    // Arrange
    const id = 111;
    const location = ScheduleCalendarActionLocationTypes.List;

    // Act
    service.onOpenConfirmModal(id, location);

    // Assert
    expect(mockDialogService.open).toHaveBeenCalledWith(
      ScheduleCalendarConfirmModalComponent,
      {
        width: '50vw',
        contentStyle: { overflow: 'auto', padding: '0' },
        breakpoints: expect.any(Object),
        focusOnShow: false,
        header: expect.any(String),
        data: { id, location },
        baseZIndex: 10000,
        templates: {
          footer: ScheduleCalendarConfirmModalFooterComponent,
        },
      },
    );
  });

  test('should handle isDetailsModalFooterVisible correctly when schedule edit permission is true', () => {
    // Arrange
    jest
      .spyOn(mockProfileStoreService, 'hasPermission')
      .mockReturnValue(signal(true));
    const result = (service as any).isDetailsModalFooterVisible(
      ScheduleStatus.Confirmed,
      '2030-01-01T00:00:00Z',
    );

    // Assert
    expect(result).toBe(true);

    // Arrange
    const result2 = (service as any).isDetailsModalFooterVisible(
      ScheduleStatus.ToBeConfirmed,
      '2030-01-01T00:00:00Z',
    );

    // Assert
    expect(result2).toBe(true);

    // Arrange
    const result3 = (service as any).isDetailsModalFooterVisible(
      'RabbitStatus',
      '2030-01-01T00:00:00Z',
    );

    // Assert
    expect(result3).toBe(false);

    // Arrange
    const result4 = (service as any).isDetailsModalFooterVisible(
      ScheduleStatus.Confirmed,
      '2000-01-01T00:00:00Z',
    );

    // Assert
    expect(result4).toBe(false);
  });

  test('should handle isDetailsModalFooterVisible correctly when schedule edit permission is false', () => {
    // Arrange
    jest
      .spyOn(mockProfileStoreService, 'hasPermission')
      .mockReturnValue(signal(false));
    const result = (service as any).isDetailsModalFooterVisible(
      ScheduleStatus.Confirmed,
      '2030-01-01T00:00:00Z',
    );

    // Assert
    expect(result).toBe(false);

    // Arrange
    const result2 = (service as any).isDetailsModalFooterVisible(
      ScheduleStatus.ToBeConfirmed,
      '2030-01-01T00:00:00Z',
    );

    // Assert
    expect(result2).toBe(false);

    // Arrange
    const result3 = (service as any).isDetailsModalFooterVisible(
      'RabbitStatus',
      '2030-01-01T00:00:00Z',
    );

    // Assert
    expect(result3).toBe(false);

    // Arrange
    const result4 = (service as any).isDetailsModalFooterVisible(
      ScheduleStatus.Confirmed,
      '2000-01-01T00:00:00Z',
    );

    // Assert
    expect(result4).toBe(false);
  });
});
