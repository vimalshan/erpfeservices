import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { filter, map, Observable, tap } from 'rxjs';

import {
  ContractsListItemModel,
  ContractsListMapperService,
  ContractsListService,
  ContractsListStoreService,
} from '@customer-portal/data-access/contracts';
import {
  DocType,
  DownloadFileNames,
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import {
  DocumentQueueService,
  DocumentsService,
} from '@customer-portal/data-access/documents/services';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import {
  ColumnDefinition,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
} from '@customer-portal/shared/models';

import { CONTRACTS_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-contract-list',
  imports: [
    CommonModule,
    TranslocoModule,
    GridComponent,
    SharedButtonComponent,
  ],
  providers: [ContractsListStoreService],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractListComponent
  extends BasePreferencesComponent
  implements OnDestroy, OnInit
{
  @ViewChild('grid') gridComponent!: GridComponent;
  @ViewChild('bulkDownloadBtn', { read: ElementRef })
  bulkDownloadBtn!: ElementRef;
  cols: ColumnDefinition[] = CONTRACTS_LIST_COLUMNS;
  shouldDisplayDownloadBtn = false;
  selectedContractsIds: number[] = [];
  sharedButtonType = SharedButtonType;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.contractsListStoreService.loadContractsList();
    }),
  );

  constructor(
    public contractsListStoreService: ContractsListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private documentQueueService: DocumentQueueService,
    private documentsService: DocumentsService,
    private contractsListService: ContractsListService,
  ) {
    super();

    this.initializePreferences(
      PageName.ContractList,
      ObjectName.Contracts,
      ObjectType.Grid,
    );
  }

  ngOnInit(): void {
    this.registerDownloadHandlers();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.contractsListStoreService.updateGridConfig(gridConfig);
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  onTriggerFileAction({
    event,
    fileName,
    documentId,
  }: {
    event: GridFileActionEvent;
    fileName: string;
    documentId: number;
  }): void {
    if (event.actionType === GridFileActionType.Download) {
      this.documentQueueService.addDownloadTask(
        DownloadType.Contract,
        DownloadTypeName.Contract,
        fileName,
        { documentId },
      );

      if (event.element) {
        animateFlyToDownload(event.element);
      }
    }
  }

  onExportExcelClick(): void {
    const filterConfig = {
      ...this.contractsListStoreService.filteringConfigSignal(),
    };
    const payload =
      ContractsListMapperService.mapToContractsExcelPayloadDto(filterConfig);
    const fileName = 'contracts.xlsx';

    this.documentQueueService.addDownloadTask(
      DownloadType.ContractExcel,
      DownloadTypeName.ContractExcel,
      fileName,
      { payload },
    );

    const exportBtnEl = this.gridComponent.getExportButtonElement();

    if (exportBtnEl) {
      animateFlyToDownload(exportBtnEl);
    }
  }

  onSelectionChangeData(selectedContracts: ContractsListItemModel[]): void {
    this.shouldDisplayDownloadBtn = selectedContracts?.length > 0;

    if (this.shouldDisplayDownloadBtn) {
      this.selectedContractsIds = selectedContracts.map((contract) =>
        Number(contract.contractId),
      );
    }
  }

  downloadSelectedContracts(): void {
    this.documentQueueService.addDownloadTask(
      DownloadType.ContractBulk,
      DownloadTypeName.ContractBulk,
      'contracts.zip',
      { ids: this.selectedContractsIds, docType: DocType.Contract },
    );

    if (this.bulkDownloadBtn?.nativeElement) {
      animateFlyToDownload(this.bulkDownloadBtn.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.contractsListStoreService.resetContractListState();
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.Contract,
      this.createSingleContractDownloadHandler(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.ContractBulk,
      this.createBulkContractDownloadHandler(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.ContractExcel,
      this.createExcelExportHandler(),
    );
  }

  private createSingleContractDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadDocument(data.documentId, fileName, true)
        .pipe(map((response) => this.mapDownloadResponse(response, fileName)));
  }

  private createBulkContractDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadAllDocuments(data.ids, data.docType, true)
        .pipe(map((response) => this.mapDownloadResponse(response, fileName)));
  }

  private createExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.contractsListService.exportContractsExcel(data.payload, true).pipe(
        map((input) => ({
          blob: new Blob([new Uint8Array(input)], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          fileName: fileName || DownloadFileNames.ContractExcel,
        })),
      );
  }

  private mapDownloadResponse(
    response: any,
    fallbackFileName: string,
  ): { blob: Blob; fileName: string } {
    if (!response.body) {
      throw new Error('Document download failed: Blob is null');
    }
    const contentDisposition = response.headers.get('content-disposition');

    if (!contentDisposition && response.headers) {
      throw new Error('Content-Disposition header is missing');
    }

    return {
      blob: response.body,
      fileName:
        this.documentQueueService.extractFileName(contentDisposition ?? '') ||
        fallbackFileName,
    };
  }
}
