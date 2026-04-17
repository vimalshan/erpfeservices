import {
  CertificateDetailsStoreService,
  createCertificateDetailsStoreServiceMock,
} from '@customer-portal/data-access/certificates';
import { GridConfig, SortingMode } from '@customer-portal/shared';

import { CertificateSitesListComponent } from './certificate-sites-list.component';

describe('CertificateSitesListComponent', () => {
  let component: CertificateSitesListComponent;
  const mockCertificateDetailsStoreService: Partial<CertificateDetailsStoreService> =
    createCertificateDetailsStoreServiceMock();

  beforeEach(async () => {
    component = new CertificateSitesListComponent(
      mockCertificateDetailsStoreService as CertificateDetailsStoreService,
    );
  });

  test('should load sites list', () => {
    // Assert
    expect(mockCertificateDetailsStoreService.loadSitesList).toHaveBeenCalled();
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
      mockCertificateDetailsStoreService.updateSitesListGridConfig,
    ).toHaveBeenCalledWith(gridConfig);
  });
});
