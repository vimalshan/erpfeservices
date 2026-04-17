import { runInInjectionContext, signal, WritableSignal } from '@angular/core';

import {
  ContractsListItemModel,
  ContractsListStoreService,
} from '@customer-portal/data-access/contracts';
import {
  createDocumentStoreServiceMock,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';
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

import { ContractListComponent } from './contract-list.component';

describe('ContractListComponent', () => {
  let component: ContractListComponent;
  let contractsListStoreServiceMock: Partial<ContractsListStoreService>;
  const hasActiveFilters: WritableSignal<boolean> = signal(false);
  const documentsStoreServiceMock: Partial<DocumentsStoreService> =
    createDocumentStoreServiceMock();
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    contractsListStoreServiceMock = {
      hasActiveFilters,
      updateGridConfig: jest.fn(),
      resetContractListState: jest.fn(),
      loadContractsList: jest.fn(),
      contracts: signal([]),
    };

    const injector = createPreferenceMockInjector();

    runInInjectionContext(injector, () => {
      component = new ContractListComponent(
        contractsListStoreServiceMock as ContractsListStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        documentsStoreServiceMock as DocumentsStoreService,
      );
    });
  });

  test('should initialize preferences', () => {
    // Assert
    expect(
      (component as any).preferenceStoreService.loadPreference,
    ).toHaveBeenCalledWith(
      PageName.ContractList,
      ObjectName.Contracts,
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
      pageName: PageName.ContractList,
      objectName: ObjectName.Contracts,
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
    expect(contractsListStoreServiceMock.updateGridConfig).toHaveBeenCalledWith(
      gridConfig,
    );
  });

  test('should reset contracts list state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      contractsListStoreServiceMock.resetContractListState,
    ).toHaveBeenCalled();
  });
  describe('onSelectionChangeData', () => {
    test('should set shouldDisplayDownloadBtn to true when selectedContracts is not empty', () => {
      // Arrange
      const selectedContracts: ContractsListItemModel[] = [
        {
          contractId: '1',
          contractName: 'test',
          contractType: 'audit',
          company: 'Test1',
          service: 'service',
          sites: 'Berlin',
          dateAdded: '10-10-2024',
          actions: 'actions' as any,
          documentId: 'documentId',
          fileName: 'File Name.txt',
        },
      ];

      // Act
      component.onSelectionChangeData(selectedContracts);

      // Assert
      expect(component.shouldDisplayDownloadBtn).toBe(true);
    });

    test('should set shouldDisplayDownloadBtn to false when selectedContracts is empty', () => {
      // Arrange
      const selectedContracts = [] as any;

      // Act
      component.onSelectionChangeData(selectedContracts);

      // Assert
      expect(component.shouldDisplayDownloadBtn).toBe(false);
    });
  });
});
