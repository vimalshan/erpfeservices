import { runInInjectionContext, signal, WritableSignal } from '@angular/core';

import { AuditListStoreService } from '@erp-services/data-access/audit';
import {
  createSettingsCoBrowsingStoreServiceMock,
  SettingsCoBrowsingStoreService,
} from '@erp-services/data-access/settings';
import { createPreferenceMockInjector } from '@erp-services/preferences';
import {
  GridConfig,
  ObjectName,
  ObjectType,
  PageName,
  SortingMode,
} from '@erp-services/shared';

import { AuditListComponent } from './audit-list.component';

describe('AuditListComponent', () => {
  let component: AuditListComponent;
  let auditListStoreServiceMock: Partial<AuditListStoreService>;
  const hasActiveFilters: WritableSignal<boolean> = signal(false);
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(() => {
    const injector = createPreferenceMockInjector();

    auditListStoreServiceMock = {
      loadAuditList: jest.fn(),
      hasActiveFilters,
      updateGridConfig: jest.fn(),
      exportAuditsExcel: jest.fn(),
      resetAuditListState: jest.fn(),
    };

    runInInjectionContext(injector, () => {
      component = new AuditListComponent(
        auditListStoreServiceMock as AuditListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
      );
    });
  });

  test('should initialize preferences', () => {
    // Assert
    expect(
      (component as any).preferenceStoreService.loadPreference,
    ).toHaveBeenCalledWith(
      PageName.AuditList,
      ObjectName.Audits,
      ObjectType.Grid,
    );
  });

  test('should save preferences', () => {
    // Arrange
    const data = { data: 'data' };

    // Act
    component.onSavePreference(data);

    // Assert
    expect(
      (component as any).preferenceStoreService.savePreference,
    ).toHaveBeenCalledWith({
      data,
      pageName: PageName.AuditList,
      objectName: ObjectName.Audits,
      objectType: ObjectType.Grid,
    });
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
    expect(auditListStoreServiceMock.updateGridConfig).toHaveBeenCalledWith(
      gridConfig,
    );
  });

  test('should trigger export excel when excel button clicked', () => {
    // Act
    component.onExportExcelClick();

    // Assert
    expect(auditListStoreServiceMock.exportAuditsExcel).toHaveBeenCalled();
  });

  test('should reset audit list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(auditListStoreServiceMock.resetAuditListState).toHaveBeenCalled();
  });
});
