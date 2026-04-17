import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { catchError, map, Observable } from 'rxjs';

import { LoggingService } from '@customer-portal/core/app-insights';
import {
  CertificateDetailsStoreService,
  CertificateDocumentsListItemModel,
} from '@customer-portal/data-access/certificates';
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
import { GridComponent } from '@customer-portal/shared/components/grid';
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import {
  ColumnDefinition,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
} from '@customer-portal/shared/models';

import { CERTIFICATE_DOCUMENTS_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-certificate-documents',
  imports: [
    CommonModule,
    GridComponent,
    TranslocoDirective,
    SharedButtonComponent,
  ],
  templateUrl: './certificate-documents.component.html',
  styleUrl: './certificate-documents.component.scss',
})
export class CertificateDocumentsComponent implements OnInit {
  @ViewChild('bulkDownloadBtn', { read: ElementRef })
  bulkDownloadBtn!: ElementRef;
  cols: ColumnDefinition[] = CERTIFICATE_DOCUMENTS_COLUMNS;
  documentsList = this.certificateDetailsStoreService.certificateDocumentsList;
  displayDownloadButton = false;
  selectedDocumentsIds: number[] = [];
  sharedButtonType = SharedButtonType;

  constructor(
    public certificateDetailsStoreService: CertificateDetailsStoreService,
    private documentsService: DocumentsService,
    private documentQueueService: DocumentQueueService,
    private loggingService: LoggingService,
  ) {}

  ngOnInit(): void {
    this.certificateDetailsStoreService.loadCertificateDocumentsList();
    this.registerDownloadHandlers();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.certificateDetailsStoreService.updateCertificateDocumentsListGridConfig(
      gridConfig,
    );
  }

  triggerFileAction({
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
        DownloadType.Certificate,
        DownloadTypeName.Certificate,
        fileName,
        { documentId },
      );

      if (event.element) {
        animateFlyToDownload(event.element);
      }
    }
  }

  onSelectionChangeData(
    selectedDocuments: CertificateDocumentsListItemModel[],
  ): void {
    this.displayDownloadButton = selectedDocuments?.length > 0;

    if (this.displayDownloadButton) {
      this.selectedDocumentsIds = selectedDocuments.map(
        (doc) => doc.documentId,
      );
    }
  }

  downloadSelectedDocuments(): void {
    this.documentQueueService.addDownloadTask(
      DownloadType.CertificateBulk,
      DownloadTypeName.CertificateBulk,
      'Certificate List.zip',
      { ids: this.selectedDocumentsIds, docType: DocType.Certificate },
    );

    if (this.bulkDownloadBtn?.nativeElement) {
      animateFlyToDownload(this.bulkDownloadBtn.nativeElement);
    }
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.Certificate,
      this.createCertificateDownloadHandler(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.CertificateBulk,
      this.createBulkCertificateDownloadHandler(),
    );
  }

  private createCertificateDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadDocument(data.documentId, fileName, true)
        .pipe(
          map((response) => {
            const result = this.mapDownloadResponse(response, fileName);
            this.loggingService.logEvent('Certificate_Download_Success', {
              fileName: result.fileName,
              documentId: data.documentId,
              timestamp: new Date().toISOString(),
            });

            return result;
          }),
          catchError((error) => {
            this.loggingService.logEvent('Certificate_Download_Failed', {
              documentId: data.documentId,
              error: error?.message || error,
              timestamp: new Date().toISOString(),
            });
            throw error;
          }),
        );
  }

  private createBulkCertificateDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadAllDocuments(data.ids, data.docType, true)
        .pipe(
          map((response) => {
            const result = this.mapDownloadResponse(response, fileName);
            this.loggingService.logEvent('Certificate_Bulk_Download_Success', {
              fileName: result.fileName,
              ids: data.ids,
              docType: data.docType,
              timestamp: new Date().toISOString(),
            });

            return result;
          }),
          catchError((error) => {
            this.loggingService.logEvent('Certificate_Bulk_Download_Failed', {
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
