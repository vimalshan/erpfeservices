import { runInInjectionContext, Signal, WritableSignal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import {
  createScheduleListStoreServiceMock,
  ScheduleCalendarActionLocationTypes,
  ScheduleCalendarActionStoreService,
  ScheduleListStoreService,
} from '@customer-portal/data-access/schedules';
import {
  createSettingsCoBrowsingStoreServiceMock,
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { createPreferenceMockInjector } from '@customer-portal/preferences';
import {
  GridConfig,
  GridEventAction,
  GridEventActionType,
  Language,
  ObjectName,
  ObjectType,
  PageName,
  SortingMode,
} from '@customer-portal/shared';

import { ScheduleCalendarEventService } from '../../services';
import { ScheduleListComponent } from './schedule-list.component';

describe('ScheduleListComponent', () => {
  let component: ScheduleListComponent;
  const scheduleListStoreServiceMock: Partial<ScheduleListStoreService> =
    createScheduleListStoreServiceMock();
  let mockScheduleEventService: Partial<ScheduleCalendarEventService>;
  const mockScheduleCalendarActionStoreService: Partial<ScheduleCalendarActionStoreService> =
    {
      loadScheduleCalendarAddToCalendar: jest.fn(),
      loadScheduleCalendarShareInvite: jest.fn(),
    };
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  const mockServiceNowService: Partial<ServiceNowService> = {
    openScheduleSupport: jest.fn(),
  };

  const mockMessageService: Partial<MessageService> = {
    add: jest.fn(),
  };

  const mockLoggingService: Partial<LoggingService> = {
    logException: jest.fn(),
  };

  const mockTranslocoService: Partial<TranslocoService> = {
    translate: jest.fn().mockReturnValue('Translated Text'),
  };

  const mockProfileLanguageStoreService: Partial<ProfileLanguageStoreService> =
    {
      languageLabel: (() => 'English' as Language) as Signal<Language>,
    };

  beforeEach(async () => {
    jest.clearAllMocks();

    const injector = createPreferenceMockInjector();

    mockScheduleEventService = {
      onOpenDetailsModal: jest.fn(),
      onOpenRescheduleModal: jest.fn(),
      onOpenConfirmModal: jest.fn(),
      registerRequestChangesCallback: jest.fn(),
    };

    runInInjectionContext(injector, () => {
      component = new ScheduleListComponent(
        mockScheduleCalendarActionStoreService as ScheduleCalendarActionStoreService,
        mockScheduleEventService as ScheduleCalendarEventService,
        scheduleListStoreServiceMock as ScheduleListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        mockTranslocoService as TranslocoService,
        mockServiceNowService as ServiceNowService,
        mockMessageService as MessageService,
        mockLoggingService as LoggingService,
        mockProfileLanguageStoreService as ProfileLanguageStoreService,
      );
    });
  });

  test('should initialize preferences', () => {
    // Assert
    expect(
      (component as any).preferenceStoreService.loadPreference,
    ).toHaveBeenCalledWith(
      PageName.ScheduleList,
      ObjectName.Schedules,
      ObjectType.Grid,
    );
  });

  test('should update grid config when grid config changed', () => {
    // Arrange
    const gridConfig: GridConfig = {
      filtering: {},
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 1,
      },
      sorting: {
        mode: SortingMode.Multiple,
        rules: [],
      },
    };
    // Act
    component.onGridConfigChanged(gridConfig);

    // Assert
    expect(scheduleListStoreServiceMock.updateGridConfig).toHaveBeenCalledWith(
      gridConfig,
    );
  });

  describe('onExportExcelClick', () => {
    test('should call exportAuditSchedulesExcel on scheduleListStoreService', () => {
      // Act
      component.onExportExcelClick();

      // Assert
      expect(
        scheduleListStoreServiceMock.exportAuditSchedulesExcel,
      ).toHaveBeenCalled();
    });
  });

  describe('onSavePreference', () => {
    test('should call savePreference on preferenceStoreService with correct model', () => {
      // Arrange
      const data = { some: 'data' };

      // Act
      component.onSavePreference(data);

      // Assert
      expect(
        (component as any).preferenceStoreService.savePreference,
      ).toHaveBeenCalledWith({
        data,
        pageName: PageName.ScheduleList,
        objectName: ObjectName.Schedules,
        objectType: ObjectType.Grid,
      });
    });
  });

  describe('triggerEventAction', () => {
    test('should call confirmEvent when actionType is Confirm', () => {
      // Arrange
      const event = {
        id: '123',
        actionType: GridEventActionType.Confirm,
      } as GridEventAction;

      // Act
      component.triggerEventAction({ event });

      // Assert
      expect(mockScheduleEventService.onOpenConfirmModal).toHaveBeenCalledWith(
        123,
        ScheduleCalendarActionLocationTypes.List,
      );
    });

    test('should not call confirmEvent when actionType is not Confirm', () => {
      // Arrange
      const event = {
        id: '123',
        actionType: GridEventActionType.Reschedule,
      } as GridEventAction;

      // Act
      component.triggerEventAction({ event });

      // Assert
      expect(
        mockScheduleEventService.onOpenConfirmModal,
      ).not.toHaveBeenCalled();
    });

    test('should call downloadAddToCalendar method if actionType is "Add to calendar"', () => {
      // Arrange
      const event = {
        id: '1',
        actionType: GridEventActionType.AddToCalendar,
      } as GridEventAction;

      // Act
      component.triggerEventAction({ event });

      // Assert
      expect(
        mockScheduleCalendarActionStoreService.loadScheduleCalendarAddToCalendar,
      ).toHaveBeenCalledWith(Number(event.id));
    });

    test('should call openRescheduleModal when actionType is Reschedule', () => {
      // Arrange
      const event = {
        id: '123',
        actionType: GridEventActionType.Reschedule,
      } as GridEventAction;

      // Act
      component.triggerEventAction({ event });

      // Assert
      expect(
        mockScheduleEventService.onOpenRescheduleModal,
      ).toHaveBeenCalledWith(123, ScheduleCalendarActionLocationTypes.List);
    });
  });

  test('should call openScheduleServiceNowSupport when actionType is Request changes', () => {
    // Arrange
    const event = {
      id: 123,
      actionType: GridEventActionType.RequestChanges,
    } as GridEventAction;
    const spy = jest.spyOn(component as any, 'openScheduleServiceNowSupport');

    // Act
    component.triggerEventAction({ event });

    // Assert
    expect(spy).toHaveBeenCalledWith(123);
  });

  test('should reset schedule list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      scheduleListStoreServiceMock.resetScheduleListState,
    ).toHaveBeenCalled();
  });
});
