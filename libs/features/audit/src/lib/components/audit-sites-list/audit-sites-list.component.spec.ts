import {
  AuditDetailsStoreService,
  createAuditDetailsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import { GridConfig, SortingMode } from '@customer-portal/shared';

import { AuditSitesListComponent } from './audit-sites-list.component';

describe('AuditSitesListComponent', () => {
  let component: AuditSitesListComponent;
  const auditDetailsStoreServiceMock: Partial<AuditDetailsStoreService> =
    createAuditDetailsStoreServiceMock();

  beforeEach(async () => {
    component = new AuditSitesListComponent(
      auditDetailsStoreServiceMock as AuditDetailsStoreService,
    );
  });

  it('should load sites list', () => {
    // Assert
    expect(auditDetailsStoreServiceMock.loadSitesList).toHaveBeenCalled();
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
      auditDetailsStoreServiceMock.updateSitesListGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
  });
});
