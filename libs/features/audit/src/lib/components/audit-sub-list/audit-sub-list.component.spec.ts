import {
  AuditDetailsStoreService,
  createAuditDetailsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import { GridConfig, SortingMode } from '@customer-portal/shared';

import { AuditSubListComponent } from './audit-sub-list.component';

describe('AuditSubListComponent', () => {
  let component: AuditSubListComponent;
  const auditDetailsStoreServiceMock: Partial<AuditDetailsStoreService> =
    createAuditDetailsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditSubListComponent(
      auditDetailsStoreServiceMock as AuditDetailsStoreService,
    );
  });

  test('should load sub audits', () => {
    // Assert
    expect(auditDetailsStoreServiceMock.loadSubAuditList).toHaveBeenCalled();
  });

  test('should call updateSubAuditGridConfig when grid config changes', () => {
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
      auditDetailsStoreServiceMock.updateSubAuditGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
  });

  test('should call exportSubAuditsExcel when export button is clicked', () => {
    // Act
    component.onExportExcelClick();

    // Assert
    expect(
      auditDetailsStoreServiceMock.exportSubAuditsExcel,
    ).toHaveBeenCalled();
  });
});
