import {
  AuditDetailsStoreService,
  createAuditDetailsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import { GridConfig, SortingMode } from '@customer-portal/shared';

import { AuditFindingListComponent } from './audit-finding-list.component';

describe('AuditFindingListComponent', () => {
  let component: AuditFindingListComponent;
  const auditDetailsStoreServiceMock: Partial<AuditDetailsStoreService> =
    createAuditDetailsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditFindingListComponent(
      auditDetailsStoreServiceMock as AuditDetailsStoreService,
    );
  });

  test('should load audit findings list', () => {
    // Assert
    expect(
      auditDetailsStoreServiceMock.loadAuditFindingsList,
    ).toHaveBeenCalled();
  });

  test('should call updateAuditFindingListGridConfig when grid config changes', () => {
    // Arrange
    const gridConfig: GridConfig = {
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
      sorting: {
        mode: SortingMode.Multiple,
        rules: [],
      },
      filtering: {},
    };

    // Act
    component.onGridConfigChanged(gridConfig);

    // Assert
    expect(
      auditDetailsStoreServiceMock.updateAuditFindingListGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
  });

  test('should call exportAuditFindingsExcel when export button is clicked', () => {
    // Act
    component.onExportExcelClick();

    // Assert
    expect(
      auditDetailsStoreServiceMock.exportAuditFindingsExcel,
    ).toHaveBeenCalled();
  });
});
