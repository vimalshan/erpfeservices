import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { map } from 'rxjs';

import {
  AuditDetailsMapperService,
  AuditDetailsService,
  AuditDetailsStoreService,
} from '@customer-portal/data-access/audit';
import {
  DownloadFileNames,
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import { DocumentQueueService } from '@customer-portal/data-access/documents/services';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  FINDINGS_STATUS_STATES_MAP,
  FINDINGS_TAG_STATES_MAP,
} from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { AUDIT_FINDING_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-finding-list',
  imports: [CommonModule, GridComponent, TranslocoDirective],
  providers: [],
  templateUrl: './audit-finding-list.component.html',
  styleUrl: './audit-finding-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditFindingListComponent implements OnInit {
  @ViewChild('grid') gridComponent!: GridComponent;

  tagStatesMap = FINDINGS_TAG_STATES_MAP;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  cols: ColumnDefinition[] = AUDIT_FINDING_LIST_COLUMNS;

  constructor(
    public auditDetailsStoreService: AuditDetailsStoreService,
    private documentQueueService: DocumentQueueService,
    private auditDetailsService: AuditDetailsService,
  ) {
    this.auditDetailsStoreService.loadAuditFindingsList();
  }

  ngOnInit(): void {
    this.registerDownloadHandlers();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateAuditFindingListGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    const filterConfig = {
      ...this.auditDetailsStoreService.auditFindingFilteringConfigSignal(),
    };
    const auditId = this.auditDetailsStoreService.auditId();
    const payload = AuditDetailsMapperService.mapToAuditFindingsExcelPayloadDto(
      filterConfig,
      auditId,
    );

    this.documentQueueService.addDownloadTask(
      DownloadType.AuditFindingExcel,
      DownloadTypeName.AuditFindingExcel,
      DownloadFileNames.AuditFindingsExcel,
      { payload },
    );

    const exportBtnEl = this.gridComponent.getExportButtonElement();

    if (exportBtnEl) {
      animateFlyToDownload(exportBtnEl);
    }
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.AuditFindingExcel,
      this.createAuditExcelExportHandler(),
    );
  }

  private createAuditExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => any {
    return (data, fileName) =>
      this.auditDetailsService
        .exportAuditFindingsExcel(data.payload, true)
        .pipe(
          map((input: number[]) => ({
            blob: new Blob([new Uint8Array(input)], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            fileName: fileName || DownloadFileNames.AuditFindingsExcel,
          })),
        );
  }
}
