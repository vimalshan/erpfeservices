import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuditDetailsStoreService } from '@customer-portal/data-access/audit';
import { GridComponent } from '@customer-portal/shared/components/grid';
import { STATUS_STATES_MAP } from '@customer-portal/shared/constants';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { AUDIT_SITES_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-sites-list',
  imports: [CommonModule, GridComponent, TranslocoDirective],
  providers: [],
  templateUrl: './audit-sites-list.component.html',
  styleUrl: './audit-sites-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditSitesListComponent {
  statusStatesMap = STATUS_STATES_MAP;
  cols: ColumnDefinition[] = AUDIT_SITES_LIST_COLUMNS;

  constructor(public auditDetailsStoreService: AuditDetailsStoreService) {
    this.auditDetailsStoreService.loadSitesList();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateSitesListGridConfig(gridConfig);
  }
}
