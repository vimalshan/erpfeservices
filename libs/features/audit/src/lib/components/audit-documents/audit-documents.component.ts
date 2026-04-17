import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { map, Observable, take } from 'rxjs';

import {
  AuditDetailsStoreService,
  AuditDocumentListItemModel,
  AuditFileUploadService,
} from '@customer-portal/data-access/audit';
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
  DocumentsStoreService,
  UploadDocumentsSuccess,
} from '@customer-portal/data-access/documents/state';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  AddDocumentsComponent,
  AddDocumentsFooterComponent,
} from '@customer-portal/features/upload';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { buttonStyleClass } from '@customer-portal/shared/components/custom-confirm-dialog';
import { GridComponent } from '@customer-portal/shared/components/grid';
import { modalBreakpoints } from '@customer-portal/shared/constants';
import { animateFlyToDownload } from '@customer-portal/shared/helpers';
import { ErrorMessages } from '@customer-portal/shared/helpers/upload';
import {
  ColumnDefinition,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
} from '@customer-portal/shared/models';

import { AUDIT_DOCUMENTS_COLUMNS } from '../../constants';

enum FileUploadErrors {
  Error_001 = 'audit.fileUpload.fileUploadWrongName',
  Error_002 = 'audit.fileUpload.fileUploadFailed',
  Error_003 = 'audit.fileUpload.fileUploadWrongSize',
  Error_004 = 'audit.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'audit.fileUpload.fileUploadGenericError',
}

const FILE_UPLOAD_SUCCESS = 'audit.fileUpload.fileUploadSuccess';

@Component({
  selector: 'lib-audit-documents',
  imports: [
    CommonModule,
    SharedButtonComponent,
    DynamicDialogModule,
    GridComponent,
    TranslocoDirective,
    MessagesModule,
  ],
  providers: [DialogService, AuditFileUploadService],
  templateUrl: './audit-documents.component.html',
  styleUrl: './audit-documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDocumentsComponent implements OnDestroy, OnInit {
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  @ViewChild('bulkDownloadBtn', { read: ElementRef })
  bulkDownloadBtn!: ElementRef;
  auditId = this.auditDetailsStoreService.auditId();
  cols: ColumnDefinition[] = AUDIT_DOCUMENTS_COLUMNS;
  ref: DynamicDialogRef | undefined;
  displayDownloadButton = false;
  selectedDocumentsIds: number[] = [];
  sharedButtonType = SharedButtonType;
  canAddDocuments = computed(
    () =>
      !this.settingsCoBrowsingStoreService.isDnvUser() &&
      this.profileStoreService.hasPermission(
        PermissionCategories.Audits,
        PermissionsList.Edit,
      )(),
  );

  auditDetails = this.auditDetailsStoreService.auditDetails;
  auditDocumentsList = this.auditDetailsStoreService.auditDocumentsList;

  constructor(
    public auditDetailsStoreService: AuditDetailsStoreService,
    private dialogService: DialogService,
    private ts: TranslocoService,
    private confirmationService: ConfirmationService,
    private documentsStoreService: DocumentsStoreService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private documentQueueService: DocumentQueueService,
    private documentsService: DocumentsService,
  ) {
    this.auditDetailsStoreService.loadAuditDocumentsList();

    this.documentsStoreService.loadUploadDocumentsInfo(
      '/AuditDocumentUpload',
      FileUploadErrors,
      FILE_UPLOAD_SUCCESS,
    );

    this.actions$
      .pipe(
        ofActionSuccessful(UploadDocumentsSuccess),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.auditDetailsStoreService.loadAuditDocumentsList();
      });
  }

  ngOnInit(): void {
    this.registerDownloadHandlers();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  openAddDocumentsDialog(): void {
    this.dialogService
      .open(AddDocumentsComponent, {
        header: this.ts.translate('audit.attachedDocuments.addDocument'),
        width: '50vw',
        contentStyle: { overflow: 'auto' },
        breakpoints: modalBreakpoints,
        data: {
          canUploadData: false,
          errorMessages: {
            wrongFileSize: 'audit.fileUpload.fileUploadWrongSize',
            wrongFileType: 'audit.fileUpload.fileUploadWrongType',
            wrongFileNameLength: 'audit.fileUpload.fileUploadWrongNameLength',
            wrongTotalFileSize: 'audit.fileUpload.fileUploadWrongSize',
          } as ErrorMessages,
        },
        templates: {
          footer: AddDocumentsFooterComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((_) => {
        // TODO
      });
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateAuditDocumentsListGridConfig(
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
        DownloadType.AuditDetails,
        DownloadTypeName.AuditDetails,
        fileName,
        { documentId },
      );

      if (event.element) {
        animateFlyToDownload(event.element);
      }
    } else if (event.actionType === GridFileActionType.Delete) {
      this.confirmationService.confirm({
        header: this.ts.translate('audit.deleteDocument.header'),
        message: this.ts.translate('audit.deleteDocument.message'),
        acceptLabel: this.ts.translate('audit.deleteDocument.delete'),
        rejectLabel: this.ts.translate('audit.deleteDocument.cancel'),
        acceptButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.danger,
        ].join(' '),
        rejectButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.outlined,
        ].join(' '),
        accept: () => {
          const serviceName = 'auditId';
          this.documentsStoreService
            .deleteDocument(serviceName, this.auditId, documentId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.auditDetailsStoreService.loadAuditDocumentsList(),
            );
        },
      });
    }
  }

  onSelectionChangeData(selectedDocuments: AuditDocumentListItemModel[]): void {
    this.displayDownloadButton = selectedDocuments?.length > 0;

    if (this.displayDownloadButton) {
      this.selectedDocumentsIds = selectedDocuments.map(
        (doc) => doc.documentId,
      );
    }
  }

  downloadSelectedDocuments(): void {
    this.documentQueueService.addDownloadTask(
      DownloadType.AuditDetailBulk,
      DownloadTypeName.AuditDetailBulk,
      'Audit List.zip',
      { ids: this.selectedDocumentsIds, docType: DocType.Audit },
    );

    if (this.bulkDownloadBtn?.nativeElement) {
      animateFlyToDownload(this.bulkDownloadBtn.nativeElement);
    }
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.AuditDetails,
      this.createAuditDownloadHandler(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.AuditDetailBulk,
      this.createBulkAuditDownloadHandler(),
    );
  }

  private createAuditDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadDocument(data.documentId, fileName, true)
        .pipe(map((response) => this.mapDownloadResponse(response, fileName)));
  }

  private createBulkAuditDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadAllDocuments(data.ids, data.docType, true)
        .pipe(map((response) => this.mapDownloadResponse(response, fileName)));
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
