import { CommonModule } from '@angular/common';
import {
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
  FindingDetailsStoreService,
  FindingDocumentListItemModel,
  FindingsFileUploadService,
} from '@customer-portal/data-access/findings';
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
import { animateFlyToDownload } from '@customer-portal/shared/helpers/download';
import { ErrorMessages } from '@customer-portal/shared/helpers/upload';
import {
  ColumnDefinition,
  GridConfig,
  GridFileActionEvent,
  GridFileActionType,
} from '@customer-portal/shared/models';

import { FINDINGS_DOCUMENTS_COLUMNS } from '../../constants';

enum FileUploadErrors {
  Error_001 = 'findings.fileUpload.fileUploadWrongName',
  Error_002 = 'findings.fileUpload.fileUploadFailed',
  Error_003 = 'findings.fileUpload.fileUploadWrongSize',
  Error_004 = 'findings.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'findings.fileUpload.fileUploadGenericError',
}

const FILE_UPLOAD_SUCCESS = 'findings.fileUpload.fileUploadSuccess';

@Component({
  selector: 'lib-finding-documents',
  imports: [
    CommonModule,
    SharedButtonComponent,
    DynamicDialogModule,
    GridComponent,
    TranslocoDirective,
    MessagesModule,
  ],
  providers: [DialogService, FindingsFileUploadService],
  templateUrl: './finding-documents.component.html',
  styleUrl: './finding-documents.component.scss',
})
export class FindingDocumentsComponent implements OnDestroy, OnInit {
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  @ViewChild('bulkDownloadBtn', { read: ElementRef })
  bulkDownloadBtn!: ElementRef;
  findingId = this.findingDetailsStoreService.findingId();
  cols: ColumnDefinition[] = FINDINGS_DOCUMENTS_COLUMNS;
  ref: DynamicDialogRef | undefined;
  displayDownloadButton = false;
  selectedDocumentsIds: number[] = [];
  sharedButtonType = SharedButtonType;

  documentsList = this.findingDetailsStoreService.documentsList;
  findingDetails = this.findingDetailsStoreService.findingDetails;
  isFindingOpenOrAccepted =
    this.findingDetailsStoreService.isFindingOpenOrAccepted;
  hasFindingsEditPermission = this.profileStoreService.hasPermission(
    PermissionCategories.Findings,
    PermissionsList.Edit,
  );
  isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser;

  canAddDocument = computed(
    () =>
      !this.isDnvUser() &&
      this.isFindingOpenOrAccepted() &&
      this.hasFindingsEditPermission(),
  );

  constructor(
    public dialogService: DialogService,
    public findingDetailsStoreService: FindingDetailsStoreService,
    private ts: TranslocoService,
    private confirmationService: ConfirmationService,
    private documentsStoreService: DocumentsStoreService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private documentQueueService: DocumentQueueService,
    private documentsService: DocumentsService,
  ) {
    this.findingDetailsStoreService.loadFindingDocumentsList();

    this.documentsStoreService.loadUploadDocumentsInfo(
      '/FindingDocumentUpload',
      FileUploadErrors,
      FILE_UPLOAD_SUCCESS,
      this.findingDetailsStoreService.auditId() || '',
    );

    this.actions$
      .pipe(
        ofActionSuccessful(UploadDocumentsSuccess),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.findingDetailsStoreService.loadFindingDocumentsList();
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

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.findingDetailsStoreService.updateGridConfig(gridConfig);
  }

  openAddDocumentsDialog(): void {
    this.dialogService
      .open(AddDocumentsComponent, {
        header: this.ts.translate('findings.attachedDocuments.addDocument'),
        width: '50vw',
        contentStyle: { overflow: 'auto' },
        breakpoints: modalBreakpoints,
        data: {
          canUploadData: false,
          errorMessages: {
            wrongFileSize: 'findings.fileUpload.fileUploadWrongSize',
            wrongFileType: 'findings.fileUpload.fileUploadWrongType',
            wrongFileNameLength:
              'findings.fileUpload.fileUploadWrongNameLength',
            wrongTotalFileSize: 'findings.fileUpload.fileUploadWrongSize',
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
        DownloadType.FindingDetails,
        DownloadTypeName.FindingDetails,
        fileName,
        { documentId },
      );

      if (event.element) {
        animateFlyToDownload(event.element);
      }
    } else if (event.actionType === GridFileActionType.Delete) {
      this.confirmationService.confirm({
        header: this.ts.translate('findings.deleteDocument.header'),
        message: this.ts.translate('findings.deleteDocument.message'),
        acceptLabel: this.ts.translate('findings.confirmationPopup.delete'),
        rejectLabel: this.ts.translate('findings.confirmationPopup.cancel'),
        acceptButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.danger,
        ].join(' '),
        rejectButtonStyleClass: [
          buttonStyleClass.noIcon,
          buttonStyleClass.outlined,
        ].join(' '),
        accept: () => {
          const serviceName = 'findingsId';
          this.documentsStoreService
            .deleteDocument(serviceName, this.findingId, documentId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.findingDetailsStoreService.loadFindingDocumentsList(),
            );
        },
      });
    }
  }

  onSelectionChangeData(
    selectedDocuments: FindingDocumentListItemModel[],
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
      DownloadType.FindingDetailBulk,
      DownloadTypeName.FindingDetailBulk,
      'Finding List.zip',
      { ids: this.selectedDocumentsIds, docType: DocType.Finding },
    );

    if (this.bulkDownloadBtn?.nativeElement) {
      animateFlyToDownload(this.bulkDownloadBtn.nativeElement);
    }
  }

  private registerDownloadHandlers(): void {
    this.documentQueueService.registerDownloadHandler(
      DownloadType.FindingDetails,
      this.createFindingDownloadHandler(),
    );
    this.documentQueueService.registerDownloadHandler(
      DownloadType.FindingDetailBulk,
      this.createBulkFindingDownloadHandler(),
    );
  }

  private createFindingDownloadHandler(): (
    data: any,
    fileName: string,
  ) => Observable<{ blob: Blob; fileName: string }> {
    return (data, fileName) =>
      this.documentsService
        .downloadDocument(data.documentId, fileName, true)
        .pipe(map((response) => this.mapDownloadResponse(response, fileName)));
  }

  private createBulkFindingDownloadHandler(): (
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
