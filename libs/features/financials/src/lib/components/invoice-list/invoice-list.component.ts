import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, filter, map, Observable, tap } from 'rxjs';

import {
  InvoiceParams,
  LoggingService,
  ServiceNowService,
} from '@customer-portal/core';
import {
  DownloadFileNames,
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import { DocumentQueueService } from '@customer-portal/data-access/documents/services';
import {
  InvoiceListItemModel,
  InvoiceListMapperService,
  InvoiceListService,
  InvoiceListStoreService,
  isInvoiceOverdueOrUnpaid,
} from '@customer-portal/data-access/financials';
import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings/state/store-services';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { GridComponent } from '@customer-portal/shared/components/grid';
import {
  INVOICES_STATUS_MAP,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared/constants';
import { DebounceClickDirective } from '@customer-portal/shared/directives/debounce-click';
import {
  animateFlyToDownload,
  getContentType,
  getToastContentBySeverity,
} from '@customer-portal/shared/helpers';
import {
  ColumnDefinition,
  ToastSeverity,
} from '@customer-portal/shared/models';
import {
  GridConfig,
  GridEventAction,
  GridEventActionType,
  GridFileActionEvent,
  GridFileActionType,
} from '@customer-portal/shared/models/grid';

import { INVOICE_LIST_COLUMNS } from '../../constants';
import { InvoiceEventService } from '../../services';

@Component({
  selector: 'lib-invoice-list',
  imports: [
    CommonModule,
    GridComponent,
    TranslocoDirective,
    SharedButtonComponent,
    DebounceClickDirective,
  ],
  providers: [DialogService, InvoiceEventService, InvoiceListStoreService],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent
  extends BasePreferencesComponent
  implements OnDestroy, OnInit
{
  private selectedOverdueOrUnpaidIds: (string | number)[] = [];
  private selectedInvoiceIds: string[] = [];
  @ViewChild('grid') gridComponent!: GridComponent;
  @ViewChild('bulkDownloadBtn', { read: ElementRef })
  bulkDownloadBtn!: ElementRef;
  statusMap = INVOICES_STATUS_MAP;
  cols: ColumnDefinition[] = INVOICE_LIST_COLUMNS;
  displayDownloadButton = false;
  displayUpdatePlannedPaymentDateButton = false;
  sharedButtonType = SharedButtonType;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.invoiceListStoreService.loadInvoiceList();
    }),
  );

  constructor(
    public invoiceListStoreService: InvoiceListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private invoiceEventService: InvoiceEventService,
    private overviewSharedStoreService: OverviewSharedStoreService,
    private ts: TranslocoService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private documentQueueService: DocumentQueueService,
    private invoiceListService: InvoiceListService,
  ) {
    super();

    this.initializePreferences(
      PageName.FinancialList,
      ObjectName.Financials,
      ObjectType.Grid,
    );
    const financialStatus =
      this.overviewSharedStoreService.overviewFinancialStatus();
    this.invoiceListStoreService.applyNavigationFilters(financialStatus);
  }

  ngOnInit(): void {
    this.registerDownloadHandlers();
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.invoiceListStoreService.updateGridConfig(gridConfig);
  }

  onTriggerEventAction({ event }: { event: GridEventAction }): void {
    const { id, actionType } = event;

    if (actionType === GridEventActionType.UpdateReferenceNumber) {
      this.invoiceEventService.updateReferenceNumber(id);
    }

    if (actionType === GridEventActionType.UpdatePlannedPaymentDate) {
      this.invoiceEventService.openUpdatePaymentDateModal([id]);
    }

    if (actionType === GridEventActionType.RequestChanges) {
      this.openInvoiceServiceNowSupport(id);
    }
  }

  onTriggerFileAction({
    event,
    rowData,
  }: {
    event: GridFileActionEvent;
    fileName: string;
    documentId: number;
    rowData?: any;
  }): void {
    if (event.actionType === GridFileActionType.Download) {
      this.documentQueueService.addDownloadTask(
        DownloadType.Invoice,
        DownloadTypeName.Invoice,
        `${rowData?.invoiceId ?? ''}.pdf`,
        { invoiceId: rowData.invoiceId },
      );

      if (event.element) {
        animateFlyToDownload(event.element);
      }
    }
  }

  onSelectionChangeData(selectedInvoices: InvoiceListItemModel[]) {
    this.displayDownloadButton = selectedInvoices?.length > 0;
    this.selectedInvoiceIds = selectedInvoices.map(
      (invoice) => invoice.invoiceId,
    );

    const overdueOrUnpaidInvoices = selectedInvoices.filter((invoice) =>
      isInvoiceOverdueOrUnpaid(invoice),
    );

    this.displayUpdatePlannedPaymentDateButton =
      !this.settingsCoBrowsingStoreService.isDnvUser() &&
      overdueOrUnpaidInvoices.length > 0;

    this.selectedOverdueOrUnpaidIds = overdueOrUnpaidInvoices.map(
      (invoice) => invoice.invoiceId,
    );
  }

  downloadSelectedInvoices() {
    this.documentQueueService.addDownloadTask(
      DownloadType.InvoiceBulk,
      DownloadTypeName.InvoiceBulk,
      'invoices.zip',
      { invoiceIds: this.selectedInvoiceIds },
    );

    if (this.bulkDownloadBtn?.nativeElement) {
      animateFlyToDownload(this.bulkDownloadBtn.nativeElement);
    }
  }

  updateMultiplePlannedPaymentDate(): void {
    this.invoiceEventService.openUpdatePaymentDateModal(
      this.selectedOverdueOrUnpaidIds,
    );
  }

  onExportExcelClick() {
    const filterConfig = {
      ...this.invoiceListStoreService.filteringConfigSignal(),
    };
    const payload =
      InvoiceListMapperService.mapToInvoiceExcelPayloadDto(filterConfig);

    this.documentQueueService.addDownloadTask(
      DownloadType.InvoiceExcel,
      DownloadTypeName.InvoiceExcel,
      DownloadFileNames.InvoiceExcel,
      { payload },
    );

    const exportBtnEl = this.gridComponent.getExportButtonElement();

    if (exportBtnEl) {
      animateFlyToDownload(exportBtnEl);
    }
  }

  ngOnDestroy(): void {
    this.invoiceListStoreService.resetInvoiceListState();
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.Invoice,
      this.createInvoiceDownloadHandlerGeneric(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.InvoiceBulk,
      this.createInvoiceDownloadHandlerGeneric(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.InvoiceExcel,
      this.createInvoiceExcelExportHandler(),
    );
  }

  private createInvoiceDownloadHandlerGeneric(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, _) => {
      const invoiceIds = data.invoiceIds ?? [data.invoiceId];

      return this.invoiceListService.downloadInvoices(invoiceIds, true).pipe(
        map((result) => {
          if (!result || !result.fileName || !result.content) {
            throw new Error('Download failed');
          }

          const { fileName } = result;
          this.loggingService.logEvent('Invoice_Download_Success', {
            fileName,
            invoiceIds,
            timestamp: new Date().toISOString(),
          });

          return {
            blob: new Blob([new Uint8Array(result.content)], {
              type: getContentType(result.fileName),
            }),
            fileName,
          };
        }),
        catchError((error) => {
          this.loggingService.logEvent('Invoice_Download_Failed', {
            invoiceIds,
            error: error?.message || error,
            timestamp: new Date().toISOString(),
          });
          throw error;
        }),
      );
    };
  }

  private createInvoiceExcelExportHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.invoiceListService.exportInvoices(data.payload, true).pipe(
        map((input) => {
          const result = {
            blob: new Blob([new Uint8Array(input)], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            fileName: fileName || DownloadFileNames.InvoiceExcel,
          };
          this.loggingService.logEvent('Invoice_Export_Excel_Success', {
            fileName: result.fileName,
            timestamp: new Date().toISOString(),
          });

          return result;
        }),
        catchError((error) => {
          this.loggingService.logEvent('Invoice_Export_Excel_Failed', {
            error: error?.message || error,
            timestamp: new Date().toISOString(),
          });
          throw error;
        }),
      );
  }

  private openInvoiceServiceNowSupport(invoiceId: number | string): void {
    try {
      const invoice = this.invoiceListStoreService
        .invoices()
        .find((x) => x.invoiceId === invoiceId);

      if (!invoice) {
        throw new Error(`Invoice with ID ${invoiceId} not found`);
      }

      const invoiceServiceNowParams: InvoiceParams = {
        invoice: invoice.invoiceId,
        status: invoice.status,
        reportingCountry: invoice.reportingCountry,
        projectNumber: invoice.projectNumber,
        language: this.profileLanguageStoreService.languageLabel(),
        accountDNVId: invoice.accountDNVId,
      };
      this.serviceNowService.openInvoiceSupport(invoiceServiceNowParams);
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
