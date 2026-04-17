import { runInInjectionContext, signal, WritableSignal } from '@angular/core';

import { CertificateListStoreService } from '@customer-portal/data-access/certificates';
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

import { CertificateListComponent } from './certificate-list.component';

describe('CertificateListComponent', () => {
  let component: CertificateListComponent;
  let certificateListStoreServiceMock: Partial<CertificateListStoreService>;
  const hasActiveFilters: WritableSignal<boolean> = signal(false);
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(() => {
    const injector = createPreferenceMockInjector();
    certificateListStoreServiceMock = {
      hasActiveFilters,
      updateGridConfig: jest.fn(),
      loadCertificateList: jest.fn(),
      resetCertificateListState: jest.fn(),
    };

    runInInjectionContext(injector, () => {
      component = new CertificateListComponent(
        certificateListStoreServiceMock as CertificateListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
      );
    });
  });

  test('should get the preferences', () => {
    // Assert
    expect(
      (component as any).preferenceStoreService.loadPreference,
    ).toHaveBeenCalledWith(
      PageName.CertificateList,
      ObjectName.Certificates,
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
    expect(
      certificateListStoreServiceMock.updateGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
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
      pageName: PageName.CertificateList,
      objectName: ObjectName.Certificates,
      objectType: ObjectType.Grid,
    });
  });

  test('should reset certificate list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      certificateListStoreServiceMock.resetCertificateListState,
    ).toHaveBeenCalled();
  });
});
