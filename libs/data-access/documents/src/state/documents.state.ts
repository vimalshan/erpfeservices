import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { Message, MessageService } from 'primeng/api';
import {
  catchError,
  combineLatest,
  EMPTY,
  forkJoin,
  mergeMap,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { RouteStoreService } from '@customer-portal/router';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { downloadFromByteArray } from '@customer-portal/shared/helpers/download';
import { FileUpload, ToastSeverity } from '@customer-portal/shared/models';

import { BaseFileUploadErrors } from '../models/documents.model';
import { DocumentsService } from '../services/documents.service';
import {
  DeleteDocument,
  DeleteDocumentSuccesfully,
  DeleteDocumentWithError,
  DownloadAllDocuments,
  DownloadAllDocumentsFail,
  DownloadAllDocumentsSuccess,
  DownloadDocument,
  DownloadDocumentFail,
  DownloadDocumentSuccess,
  LoadUploadDocumentsInfo,
  ShowNotificationAfterUploadDocumentFail,
  ShowNotificationAfterUploadDocumentSuccess,
  SwitchCanUploadData,
  UploadDocuments,
  UploadDocumentsSuccess,
} from './documents.actions';

export interface DocumentsStateModel {
  canUploadData: boolean;
  auditId: string;
  uploadUrl: string;
  fileUploadErrors: BaseFileUploadErrors | null;
  fileUploadSuccess: string;
}

const defaultState: DocumentsStateModel = {
  canUploadData: false,
  auditId: '',
  uploadUrl: '',
  fileUploadErrors: null,
  fileUploadSuccess: '',
};

@State<DocumentsStateModel>({
  name: 'documents',
  defaults: defaultState,
})
@Injectable()
export class DocumentsState {
  constructor(
    private documentsService: DocumentsService,
    private routeStoreService: RouteStoreService,
    private messageService: MessageService,
    private ts: TranslocoService,
  ) {}

  @Action(DownloadDocument)
  downloadDocument(
    ctx: StateContext<DocumentsStateModel>,
    { documentId, fileName }: DownloadDocument,
  ) {
    return this.documentsService.downloadDocument(documentId, fileName).pipe(
      tap((data) => {
        if (!data) return;

        ctx.dispatch(new DownloadDocumentSuccess(data));
      }),
      catchError(() => ctx.dispatch(new DownloadDocumentFail())),
    );
  }

  @Action(DownloadDocumentSuccess)
  downloadDocumentSuccesfully(
    _: StateContext<DocumentsStateModel>,
    { blob }: DownloadDocumentSuccess,
  ) {
    const contentDisposition = blob.headers.get('content-disposition');

    if (!contentDisposition) return;

    const extractedFileName = this.extractFileName(contentDisposition);

    downloadFromByteArray(blob, extractedFileName);

    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(DownloadDocumentFail)
  downloadDocumentWithError() {
    this.showErrorMessage();
  }

  @Action(DeleteDocument)
  deleteDocument(
    ctx: StateContext<DocumentsStateModel>,
    { serviceName, serviceId, documentId }: DeleteDocument,
  ) {
    return this.documentsService
      .deleteDocument(serviceName, serviceId, documentId)
      .pipe(
        tap((data) => {
          if (!data) return;

          if (data.isSuccess) {
            ctx.dispatch(new DeleteDocumentSuccesfully());
          } else {
            ctx.dispatch(new DeleteDocumentWithError());
          }
        }),
        catchError(() => ctx.dispatch(new DeleteDocumentWithError())),
      );
  }

  @Action(DeleteDocumentSuccesfully)
  deleteDocumentSuccesfully() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DeleteSuccess),
    );
  }

  @Action(DeleteDocumentWithError)
  deleteDocumentWithError() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DeleteError),
    );
  }

  @Action(SwitchCanUploadData)
  switchCanUploadData(
    ctx: StateContext<DocumentsStateModel>,
    { canUploadData }: SwitchCanUploadData,
  ) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      canUploadData,
    });
  }

  @Action(LoadUploadDocumentsInfo)
  loadUploadDocumentsInfo(
    ctx: StateContext<DocumentsStateModel>,
    {
      uploadUrl,
      fileUploadErrors,
      fileUploadSuccess,
      auditId,
    }: LoadUploadDocumentsInfo,
  ) {
    const state = ctx.getState();

    if (auditId) {
      ctx.patchState({
        ...state,
        uploadUrl,
        fileUploadErrors,
        fileUploadSuccess,
        auditId,
      });
    } else {
      ctx.patchState({
        ...state,
        uploadUrl,
        fileUploadErrors,
        fileUploadSuccess,
      });
    }
  }

  @Action(UploadDocuments)
  uploadDocuments(
    ctx: StateContext<DocumentsStateModel>,
    { files }: UploadDocuments,
  ): Observable<FileUpload[]> {
    return combineLatest([
      this.routeStoreService.getPathParamByKey('auditId'),
      this.routeStoreService.getPathParamByKey('findingId'),
    ]).pipe(
      switchMap(([auditId, findingId]) =>
        this.handleUpload(ctx, files, auditId, findingId),
      ),
      tap((data: FileUpload[]) => this.finalizeUpload(ctx, data)),
    );
  }

  @Action(ShowNotificationAfterUploadDocumentSuccess)
  showNotificationAfterUploadDocumentSuccess(
    _: StateContext<DocumentsStateModel>,
    {
      uploadStatus,
      fileUploadSuccess,
    }: ShowNotificationAfterUploadDocumentSuccess,
  ) {
    const message: Message = getToastContentBySeverity(
      ToastSeverity.UploadSuccess,
    );
    message.summary = this.ts.translate(message.summary!);
    message.detail = this.ts.translate(fileUploadSuccess, {
      filename: uploadStatus.data.fileName,
    });

    this.messageService.add(message);
  }

  @Action(ShowNotificationAfterUploadDocumentFail)
  showNotificationAfterUploadDocumentFail(
    _: StateContext<DocumentsStateModel>,
    { uploadStatus, fileUploadErrors }: ShowNotificationAfterUploadDocumentFail,
  ) {
    const message: Message = getToastContentBySeverity(
      ToastSeverity.UploadError,
    );
    message.summary = this.ts.translate(message.summary!);
    const detail =
      fileUploadErrors[
        uploadStatus.error!.errorCode as keyof typeof fileUploadErrors
      ];

    message.detail = this.ts.translate(detail, {
      filename: uploadStatus.error!.fileName,
    });
    this.messageService.add(message);
  }

  @Action(DownloadAllDocuments)
  downloadAllDocuments(
    ctx: StateContext<DocumentsStateModel>,
    { documentsIds, docType }: DownloadAllDocuments,
  ) {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadStart),
    );

    return this.documentsService
      .downloadAllDocuments(documentsIds, docType)
      .pipe(
        tap((data) => {
          if (!data) return;

          ctx.dispatch(new DownloadAllDocumentsSuccess(data));
        }),
        catchError(() => ctx.dispatch(new DownloadDocumentFail())),
      );
  }

  @Action(DownloadAllDocumentsSuccess)
  downloadAllDocumentsSuccess(
    _: StateContext<DocumentsStateModel>,
    { blob }: DownloadAllDocumentsSuccess,
  ) {
    const contentDisposition = blob.headers.get('content-disposition');

    if (!contentDisposition) return;

    const extractedFileName = this.extractFileName(contentDisposition);

    downloadFromByteArray(blob, extractedFileName);

    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(DownloadAllDocumentsFail)
  downloadAllDocumentsWithError() {
    this.showErrorMessage();
  }

  private checkData(files: File[]): File[] {
    return files.map((file) => {
      const newName = file.name.replace(/:/g, ';');

      return new File([file], newName, {
        type: file.type,
        lastModified: file.lastModified,
      });
    });
  }

  private extractFileName(contentDisposition: string): string {
    return contentDisposition
      .split(';')
      .map((x) => x.trim())
      .filter((y) => y.startsWith('filename='))
      .map((z) => z.replace('filename=', '').replace(/"/g, ''))
      .reduce((z) => z);
  }

  private finalizeUpload(
    ctx: StateContext<DocumentsStateModel>,
    data: FileUpload[],
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      canUploadData: false,
    });
    const isAnyFileUploaded = data.some(
      (uploadStatus: FileUpload) => uploadStatus.isSuccess,
    );

    if (isAnyFileUploaded) {
      ctx.dispatch(new UploadDocumentsSuccess());
    }
  }

  private handleUpload(
    ctx: StateContext<DocumentsStateModel>,
    files: File[],
    auditId: string,
    findingId: string,
  ): Observable<FileUpload[]> {
    if (auditId) {
      ctx.patchState({
        auditId,
      });
    }

    const aId = ctx.getState().auditId;
    const { uploadUrl, fileUploadErrors, fileUploadSuccess } = ctx.getState();

    if (!files || !files.length || !uploadUrl) return EMPTY;

    const dataChecked = this.checkData(files);

    return forkJoin(
      dataChecked.map((file) =>
        this.requestUploadAndTransformResponse(uploadUrl, file, aId, findingId),
      ),
    ).pipe(
      tap((uploadStatus: FileUpload[]) =>
        this.handleUploadStatus(
          ctx,
          uploadStatus,
          fileUploadSuccess,
          fileUploadErrors,
        ),
      ),
    );
  }

  private handleUploadStatus(
    ctx: StateContext<DocumentsStateModel>,
    uploadStatus: FileUpload[],
    fileUploadSuccess: string,
    fileUploadErrors: BaseFileUploadErrors | null,
  ): void {
    uploadStatus.forEach((status) => {
      if (status.isSuccess) {
        ctx.dispatch(
          new ShowNotificationAfterUploadDocumentSuccess(
            status,
            fileUploadSuccess,
          ),
        );
      } else {
        ctx.dispatch(
          new ShowNotificationAfterUploadDocumentFail(
            status,
            fileUploadErrors!,
          ),
        );
      }
    });
  }

  private requestUploadAndTransformResponse(
    uploadUrl: string,
    file: File,
    aId: string,
    findingId: string,
  ): Observable<FileUpload> {
    return this.documentsService
      .uploadDocument(uploadUrl, file, aId, findingId)
      .pipe(mergeMap((uploadStatusArray: FileUpload[]) => uploadStatusArray));
  }

  private showErrorMessage() {
    this.messageService.add(getToastContentBySeverity(ToastSeverity.Error));
  }
}
