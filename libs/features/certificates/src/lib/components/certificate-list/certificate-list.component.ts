import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';

import {
  CERTIFICATE_STATUS_MAP,
  CertificateListMapperService,
  CertificateListService,
  CertificateListStoreService,
} from '@customer-portal/data-access/certificates';
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
} from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { ColumnDefinition, GridConfig } from '@customer-portal/shared/models';

import { CERTIFICATE_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-list',
  imports: [CommonModule, GridComponent],
  providers: [CertificateListStoreService],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.scss',
})
export class CertificateListComponent
  extends BasePreferencesComponent
  implements OnDestroy, OnInit
{
  @ViewChild('grid') gridComponent!: GridComponent;
  statusMap = CERTIFICATE_STATUS_MAP;
  cols: ColumnDefinition[] = CERTIFICATE_LIST_COLUMNS;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.certificateListStoreService.loadCertificateList();
    }),
  );

  constructor(
    public certificateListStoreService: CertificateListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private documentQueueService: DocumentQueueService,
    private certificateListService: CertificateListService,
  ) {
    super();

    this.initializePreferences(
      PageName.CertificateList,
      ObjectName.Certificates,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.certificateListStoreService.updateGridConfig(gridConfig);
  }

  ngOnInit(): void {
    this.certificateListStoreService.applyNavigationFiltersFromOverview();
    this.registerDownloadHandlers();
  }

  ngOnDestroy(): void {
    this.certificateListStoreService.resetCertificateListState();
  }

  onExportExcelClick(): void {
    const filterConfig = {
      ...this.certificateListStoreService.filteringConfigSignal(),
    };
    const payload =
      CertificateListMapperService.mapToCertificateExcelPayloadDto(
        filterConfig,
      );

    this.documentQueueService.addDownloadTask(
      DownloadType.CertificateExcel,
      DownloadTypeName.CertificateExcel,
      DownloadFileNames.CertificateExcel,
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

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.CertificateExcel,
      this.createCertificateExcelExportHandler(),
    );
  }

  private createCertificateExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.certificateListService
        .exportCertificatesExcel(data.payload, true)
        .pipe(
          map((input) => ({
            blob: new Blob([new Uint8Array(input)], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            fileName: fileName || DownloadFileNames.CertificateExcel,
          })),
        );
  }
}
