import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { CertificateDetailsStoreService } from '@customer-portal/data-access/certificates';
import { GridComponent } from '@customer-portal/shared/components/grid';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { CERTIFICATES_SITES_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-sites-list',
  imports: [CommonModule, GridComponent, TranslocoDirective],
  providers: [],
  templateUrl: './certificate-sites-list.component.html',
  styleUrl: './certificate-sites-list.component.scss',
})
export class CertificateSitesListComponent {
  cols: ColumnDefinition[] = CERTIFICATES_SITES_LIST_COLUMNS;

  constructor(
    public certificateDetailsStoreService: CertificateDetailsStoreService,
  ) {
    this.certificateDetailsStoreService.loadSitesList();
  }

  get isCertificateStatusIssued(): boolean {
    return this.certificateDetailsStoreService.isCertificateStatusIssued();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.certificateDetailsStoreService.updateSitesListGridConfig(gridConfig);
  }
}
