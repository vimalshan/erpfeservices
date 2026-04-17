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
import { STATUS_STATES_MAP } from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { SUB_AUDIT_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-sub-list',
  imports: [CommonModule, GridComponent, TranslocoDirective],
  providers: [],
  templateUrl: './audit-sub-list.component.html',
  styleUrl: './audit-sub-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditSubListComponent implements OnInit {
  @ViewChild('grid') gridComponent!: GridComponent;
  statusStatesMap = STATUS_STATES_MAP;
  cols: ColumnDefinition[] = SUB_AUDIT_LIST_COLUMNS;

  constructor(
    public auditDetailsStoreService: AuditDetailsStoreService,
    private documentQueueService: DocumentQueueService,
    private auditDetailsService: AuditDetailsService,
  ) {
    this.auditDetailsStoreService.loadSubAuditList();
  }

  ngOnInit(): void {
    this.registerDownloadHandlers();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateSubAuditGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    const filterConfig = {
      ...this.auditDetailsStoreService.subAuditFilteringConfigSignal(),
    };
    const auditId = this.auditDetailsStoreService.auditId();
    const payload = AuditDetailsMapperService.mapToSubAuditExcelPayloadDto(
      +auditId,
      filterConfig,
    );

    this.documentQueueService.addDownloadTask(
      DownloadType.SubAuditExcel,
      DownloadTypeName.SubAuditExcel,
      DownloadFileNames.SubAuditExcel,
      { payload },
    );

    const exportBtnEl = this.gridComponent.getExportButtonElement();

    if (exportBtnEl) {
      animateFlyToDownload(exportBtnEl);
    }
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.SubAuditExcel,
      this.createSubAuditExcelExportHandler(),
    );
  }

  private createSubAuditExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => any {
    return (data, fileName) =>
      this.auditDetailsService.exportSubAuditsExcel(data.payload, true).pipe(
        map((input: number[]) => ({
          blob: new Blob([new Uint8Array(input)], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          fileName: fileName || DownloadFileNames.SubAuditExcel,
        })),
      );
  }
}
