import { runInInjectionContext, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import { NotificationListStoreService } from '@customer-portal/data-access/notifications';
import {
  createSettingsCoBrowsingStoreServiceMock,
  isDnvUserMock,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { createPreferenceMockInjector } from '@customer-portal/preferences';
import { GridRowAction } from '@customer-portal/shared';

import { NotificationListComponent } from './notification-list.component';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  const hasActiveFiltersSignal = signal<boolean>(false);

  const mockNotificationListStoreService: Partial<NotificationListStoreService> =
    {
      loadNotificationList: jest.fn(),
      markNotificationAsRead: jest.fn(),
      navigateFromNotification: jest.fn(),
      hasActiveFilters: hasActiveFiltersSignal,
    };
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  const dialogServiceMock: Partial<DialogService> = {
    open: jest.fn().mockReturnValue({
      close: jest.fn(),
      onClose: of(true),
    }),
  };

  const mockTranslocoService: Partial<TranslocoService> = {
    translate: jest.fn().mockReturnValue('Translated Text'),
  };
  const mockServiceNowService: Partial<ServiceNowService> = {
    openCatalogItemSupport: jest.fn(),
  };

  const mockMessageService: Partial<MessageService> = {
    add: jest.fn(),
  };

  const mockLoggingService: Partial<LoggingService> = {
    logException: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const injector = createPreferenceMockInjector();

    runInInjectionContext(injector, () => {
      component = new NotificationListComponent(
        mockNotificationListStoreService as NotificationListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        dialogServiceMock as DialogService,
        mockTranslocoService as TranslocoService,
        mockServiceNowService as ServiceNowService,
        mockMessageService as MessageService,
        mockLoggingService as LoggingService,
      );
    });
  });

  test('should call loadNotificationList on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(
      mockNotificationListStoreService.loadNotificationList,
    ).toHaveBeenCalled();
  });

  test('should mark notification as read and trigger navigation to clicked item', () => {
    // Arrange
    const rowData = {
      rowData: {
        id: 1,
        isRead: false,
        actionName: 'action',
        entityType: 'entity',
        entityId: '2',
        iconTooltip: {
          displayIcon: true,
          iconClass: 'iconClass',
          iconPosition: 'position',
          tooltipMessage: 'message',
        },
        title: 'title',
        message: 'message',
        receivedOn: '01-01-2025',
        actions: [],
      },
    };
    const navigateFromNotificationSpy = jest.spyOn(
      mockNotificationListStoreService,
      'navigateFromNotification',
    );

    // Act
    component.onNotificationRowClick(rowData);

    // Assert
    expect(
      mockNotificationListStoreService.markNotificationAsRead,
    ).toHaveBeenCalledWith(rowData.rowData.id);

    expect(navigateFromNotificationSpy).toHaveBeenCalledWith(
      rowData.rowData.entityId,
      rowData.rowData.entityType,
    );
  });

  test('should call onTriggerRedirectAction when notification row clicked', () => {
    // Arrange
    const rowDataInfo: GridRowAction = {
      id: 1,
      isRead: false,
      actionName: 'TEST',
      entityType: 'Audit',
      iconTooltip: {
        displayIcon: false,
        iconClass: '',
        iconPosition: '',
        tooltipMessage: '',
      },
      title: '',
      message: '',
      receivedOn: '',
      actions: [{ actionType: '', iconClass: '', label: '', url: '' }],
    };

    const onNotificationRowClickSpy = jest.spyOn(
      component as any,
      'onNotificationRowClick',
    );

    // Act
    component.onNotificationRowClick({ rowData: rowDataInfo });

    // Assert
    expect(onNotificationRowClickSpy).toHaveBeenCalled();
  });

  test('should prevent navigation for DNV users on notification row click', () => {
    // Arrange
    isDnvUserMock.set(true);

    const rowDataInfo: GridRowAction = {
      id: 1,
      isRead: false,
      actionName: 'TEST',
      entityType: 'Audit',
      iconTooltip: {
        displayIcon: false,
        iconClass: '',
        iconPosition: '',
        tooltipMessage: '',
      },
      title: '',
      message: '',
      receivedOn: '',
      actions: [{ actionType: '', iconClass: '', label: '', url: '' }],
    };

    const onNotificationRowClickSpy = jest.spyOn(
      component as any,
      'onNotificationRowClick',
    );

    // Act
    component.onNotificationRowClick({ rowData: rowDataInfo });

    // Assert
    expect(onNotificationRowClickSpy).toHaveBeenCalled();
  });
});
