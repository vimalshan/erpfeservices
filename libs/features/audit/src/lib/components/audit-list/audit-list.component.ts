import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';

import {
  AuditListMapperService,
  AuditListService,
  AuditListStoreService,
} from '@customer-portal/data-access/audit';
import {
  DownloadFileNames,
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import { DocumentQueueService } from '@customer-portal/data-access/documents/services';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  ObjectName,
  ObjectType,
  PageName,
  STATUS_STATES_MAP,
} from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { AUDIT_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-list',
  imports: [CommonModule, GridComponent],
  providers: [AuditListStoreService],
  templateUrl: './audit-list.component.html',
  styleUrl: './audit-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditListComponent
  extends BasePreferencesComponent
  implements OnInit, OnDestroy
{
  @ViewChild('grid') gridComponent!: GridComponent;
  statusStatesMap = STATUS_STATES_MAP;

  cols: ColumnDefinition[] = AUDIT_LIST_COLUMNS;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.auditListStoreService.loadAuditList();
    }),
  );

  constructor(
    public auditListStoreService: AuditListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private documentQueueService: DocumentQueueService,
    private auditListService: AuditListService,
  ) {
    super();

    this.initializePreferences(
      PageName.AuditList,
      ObjectName.Audits,
      ObjectType.Grid,
    );
  }

  ngOnInit(): void {
    this.auditListStoreService.applyNavigationFiltersFromOverview();
    this.registerDownloadHandlers();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditListStoreService.updateGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    const filterConfig = {
      ...this.auditListStoreService.filteringConfigSignal(),
    };

    const payload =
      AuditListMapperService.mapToAuditExcelPayloadDto(filterConfig);

    this.documentQueueService.addDownloadTask(
      DownloadType.AuditExcel,
      DownloadTypeName.AuditExcel,
      DownloadFileNames.AuditExcel,
      { payload },
    );
    const exportBtnEl = this.gridComponent.getExportButtonElement();

    if (exportBtnEl) {
      animateFlyToDownload(exportBtnEl);
    }
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  ngOnDestroy(): void {
    this.auditListStoreService.resetAuditListState();
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.AuditExcel,
      this.createAuditExcelExportHandler(),
    );
  }

  private createAuditExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.auditListService.exportAuditsExcel(data.payload, true).pipe(
        map((input) => ({
          blob: new Blob([new Uint8Array(input)], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          fileName: fileName || DownloadFileNames.AuditExcel,
        })),
      );
  }
}
