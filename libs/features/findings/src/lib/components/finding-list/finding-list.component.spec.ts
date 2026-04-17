import { runInInjectionContext, signal, WritableSignal } from '@angular/core';

import { FindingsListStoreService } from '@customer-portal/data-access/findings';
import {
  createSettingsCoBrowsingStoreServiceMock,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { createPreferenceMockInjector } from '@customer-portal/preferences';
import {
  GridConfig,
  ObjectName,
  ObjectType,
  PageName,
  SortingMode,
} from '@customer-portal/shared';

import { FindingListComponent } from './finding-list.component';

describe('FindingListComponent', () => {
  let component: FindingListComponent;
  let findingsListStoreServiceMock: Partial<FindingsListStoreService>;
  const hasActiveFilters: WritableSignal<boolean> = signal(false);
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(() => {
    const injector = createPreferenceMockInjector();
    findingsListStoreServiceMock = {
      loadFindingsList: jest.fn(),
      exportFindingsExcel: jest.fn(),
      updateGridConfig: jest.fn(),
      resetFindingsListState: jest.fn(),
      hasActiveFilters,
    };
    runInInjectionContext(injector, () => {
      component = new FindingListComponent(
        findingsListStoreServiceMock as FindingsListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
      );
    });
  });

  test('should get the grid preferences', () => {
    // Assert
    expect(
      (component as any).preferenceStoreService.loadPreference,
    ).toHaveBeenCalledWith(
      PageName.FindingList,
      ObjectName.Findings,
      ObjectType.Grid,
    );
  });

  test('should trigger export excel when excel button clicked', () => {
    // Act
    component.onExportExcelClick();

    // Assert
    expect(findingsListStoreServiceMock.exportFindingsExcel).toHaveBeenCalled();
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
    expect(findingsListStoreServiceMock.updateGridConfig).toHaveBeenCalledWith(
      gridConfig,
    );
  });

  test('should save preferences', () => {
    // Arrange
    const data = {
      filters: {},
      rowsPerPage: 10,
    };

    // Act
    component.onSavePreference(data);

    // Arrange
    expect(
      (component as any).preferenceStoreService.savePreference,
    ).toHaveBeenCalledWith({
      data,
      pageName: PageName.FindingList,
      objectName: ObjectName.Findings,
      objectType: ObjectType.Grid,
    });
  });

  test('should reset findings list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      findingsListStoreServiceMock.resetFindingsListState,
    ).toHaveBeenCalled();
  });
});
