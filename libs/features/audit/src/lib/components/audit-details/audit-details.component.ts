import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { catchError, map, Observable } from 'rxjs';

import { LoggingService } from '@customer-portal/core/app-insights';
import { SpinnerService } from '@customer-portal/core/spinner';
import { AuditDetailsStoreService } from '@customer-portal/data-access/audit';
import {
  DocType,
  DownloadType,
  DownloadTypeName,
} from '@customer-portal/data-access/documents';
import {
  DocumentQueueService,
  DocumentsService,
} from '@customer-portal/data-access/documents/services';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { StatusComponent } from '@customer-portal/shared/components/grid';
import { STATUS_STATES_MAP } from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { CustomDatePipe } from '@customer-portal/shared/pipes';

import { AuditTabViewComponent } from '../audit-tab-view/audit-tab-view.component';

@Component({
  selector: 'lib-audit-details',
  imports: [
    CommonModule,
    StatusComponent,
    AuditTabViewComponent,
    TranslocoDirective,
    SharedButtonComponent,
    CustomDatePipe,
  ],
  providers: [AuditDetailsStoreService],
  templateUrl: './audit-details.component.html',
  styleUrl: './audit-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDetailsComponent implements OnDestroy, OnInit {
  @ViewChild('planDownloadBtn', { read: ElementRef })
  planDownloadBtnRef!: ElementRef;
  @ViewChild('reportDownloadBtn', { read: ElementRef })
  reportDownloadBtnRef!: ElementRef;
  auditDetails = this.auditDetailsStoreService.auditDetails;
  statusStatesMap = STATUS_STATES_MAP;
  sharedButtonType = SharedButtonType;
  isLoading = this.auditDetailsStoreService.auditDetailsLoading;

  constructor(
    public auditDetailsStoreService: AuditDetailsStoreService,
    private spinnerService: SpinnerService,
    private documentQueueService: DocumentQueueService,
    private documentsService: DocumentsService,
    private loggingService: LoggingService,
  ) {
    this.auditDetailsStoreService.loadAuditDetails();
  }

  get auditId(): string {
    return this.auditDetailsStoreService.auditId();
  }

  handleDownload(
    documentId: number[] | undefined,
    sourceBtn?: 'plan' | 'report',
  ): void {
    if (!documentId || !documentId.length) {
      return;
    }

    this.documentQueueService.addDownloadTask(
      DownloadType.AuditDetailBulk,
      DownloadTypeName.AuditDetailBulk,
      'Audit List.zip',
      { ids: documentId, docType: DocType.Audit },
    );

    let btnRef: ElementRef | undefined;

    if (sourceBtn === 'plan') {
      btnRef = this.planDownloadBtnRef;
    } else if (sourceBtn === 'report') {
      btnRef = this.reportDownloadBtnRef;
    }

    if (btnRef?.nativeElement) {
      animateFlyToDownload(btnRef.nativeElement);
    }
  }

  ngOnInit(): void {
    this.registerDownloadHandlers();
  }

  ngOnDestroy(): void {
    this.auditDetailsStoreService.resetAuditDetailsState();
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.AuditDetailBulk,
      this.createBulkAuditDownloadHandler(),
    );
  }

  private createBulkAuditDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadAllDocuments(data.ids, data.docType, true)
        .pipe(
          map((response) => {
            const result = this.mapDownloadResponse(response, fileName);
            this.loggingService.logEvent('Audit_Bulk_Download_Success', {
              fileName: result.fileName,
              ids: data.ids,
              docType: data.docType,
              timestamp: new Date().toISOString(),
            });

            return result;
          }),
          catchError((error) => {
            this.loggingService.logEvent('Audit_Bulk_Download_Failed', {
              ids: data.ids,
              docType: data.docType,
              error: error?.message || error,
              timestamp: new Date().toISOString(),
            });
            throw error;
          }),
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
