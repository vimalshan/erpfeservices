import { runInInjectionContext } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import {
  createSettingsCoBrowsingStoreServiceMock,
  createSettingsMemberServiceMock,
  SettingsCoBrowsingStoreService,
  SettingsMembersStoreService,
} from '@customer-portal/data-access/settings';
import { createPreferenceMockInjector } from '@customer-portal/preferences';
import {
  createConfirmationServiceMock,
  createDialogServiceMock,
  createTranslationServiceMock,
  GridConfig,
  GridEventActionType,
  SortingConfig,
  SortingMode,
} from '@customer-portal/shared';

import { MembersGridComponent } from './members-grid.component';

describe('MembersGridComponent', () => {
  let component: MembersGridComponent;
  const settingsMembersStoreServiceMock: Partial<SettingsMembersStoreService> =
    createSettingsMemberServiceMock();

  const dialogServiceMock: Partial<DialogService> = createDialogServiceMock();
  const translocoServiceMock: Partial<TranslocoService> =
    createTranslationServiceMock();
  const confirmationServiceMock: Partial<ConfirmationService> =
    createConfirmationServiceMock();
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    const injector = createPreferenceMockInjector();

    runInInjectionContext(injector, () => {
      component = new MembersGridComponent(
        settingsMembersStoreServiceMock as SettingsMembersStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        dialogServiceMock as DialogService,
        translocoServiceMock as TranslocoService,
        confirmationServiceMock as ConfirmationService,
      );
    });
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should update grid config', () => {
    // Arrange
    const sortingConfig: SortingConfig = {
      mode: SortingMode.Multiple,
      rules: [],
    };
    const gridConfig: GridConfig = {
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
      sorting: sortingConfig,
      filtering: {},
    };

    // Act
    component.onGridConfigChanged(gridConfig);

    // Assert
    expect(
      settingsMembersStoreServiceMock.updateMembersGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
  });

  test('should save preferences', () => {
    // Arrange
    jest.spyOn(component as any, 'savePreferences');
    const data = {
      filters: {
        status: [
          {
            matchMode: 'in',
            operator: 'and',
            value: [],
          },
        ],
        service: [
          {
            matchMode: 'in',
            operator: 'and',
            value: [],
          },
        ],
      },
      rowsPerPage: 10,
      columns: [
        {
          field: 'status',
          displayName: 'audit.auditList.status',
          type: 'checkboxFilter',
          cellType: 'status',
          disabled: false,
          fixed: false,
        },
        {
          field: 'service',
          displayName: 'audit.auditList.service',
          type: 'searchCheckboxFilter',
          cellType: 'text',
          disabled: false,
          fixed: false,
        },
      ],
      showDefaultColumnsButton: false,
    };

    // Act
    component.onSavePreference(data);

    // Assert
    expect((component as any).savePreferences).toHaveBeenCalledWith(data);
  });

  test('should handle event action trigger for Remove', () => {
    // Arrange
    jest.spyOn(component as any, 'confirmRemoveMember');
    const data = { event: { actionType: GridEventActionType.Remove, id: '1' } };

    // Act
    component.onEventActionTrigger(data);

    // Assert
    expect((component as any).confirmRemoveMember).toHaveBeenCalledWith('1');
  });

  test('should handle event action trigger for ManagePermissions', () => {
    // Arrange
    const data = {
      event: { actionType: GridEventActionType.ManagePermissions, id: '2' },
    };

    // Act
    component.onEventActionTrigger(data);

    // Assert
    expect(dialogServiceMock.open).toHaveBeenCalled();
  });

  test('should reset members list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      settingsMembersStoreServiceMock.resetMembersListState,
    ).toHaveBeenCalled();
  });
});
