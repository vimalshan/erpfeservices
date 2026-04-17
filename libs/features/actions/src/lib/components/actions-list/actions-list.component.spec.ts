import { runInInjectionContext } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import { ActionsListStoreService } from '@customer-portal/data-access/actions';
import {
  createSettingsCoBrowsingStoreServiceMock,
  isDnvUserMock,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { createPreferenceMockInjector } from '@customer-portal/preferences';

import { ActionsListComponent } from './actions-list.component';

describe('ActionsListComponent', () => {
  let component: ActionsListComponent;

  const dialogServiceMock: Partial<DialogService> = {
    open: jest.fn().mockReturnValue({
      close: jest.fn(),
      onClose: of(true),
    }),
  };

  const mockActionsListStoreService: Partial<ActionsListStoreService> = {
    loadActionsDetails: jest.fn(),
    navigateFromAction: jest.fn(),
  };

  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    jest.clearAllMocks();

    const injector = createPreferenceMockInjector();

    runInInjectionContext(injector, () => {
      component = new ActionsListComponent(
        mockActionsListStoreService as ActionsListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        dialogServiceMock as DialogService,
      );
    });
  });

  test('should call loadActionsDetails on ngOnInit', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(mockActionsListStoreService.loadActionsDetails).toHaveBeenCalled();
  });

  test('should trigger navigation to respective action item that was clicked', () => {
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
    const navigateFromActionSpy = jest.spyOn(
      mockActionsListStoreService,
      'navigateFromAction',
    );

    // Act
    component.onActionRowClick(rowData);

    // Assert
    expect(navigateFromActionSpy).toHaveBeenCalledWith(
      rowData.rowData.entityId,
      rowData.rowData.entityType,
    );
  });

  test('should prevent navigation for DNV users on action row click', () => {
    // Arrange
    isDnvUserMock.set(true);
    // isDnvUserSignal.set(true);

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

    const navigateFromActionSpy = jest.spyOn(
      mockActionsListStoreService,
      'navigateFromAction',
    );

    // Act
    component.onActionRowClick(rowData);

    // Assert
    expect(navigateFromActionSpy).not.toHaveBeenCalled();
  });
});
