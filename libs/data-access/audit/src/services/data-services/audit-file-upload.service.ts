import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';

import { environment } from '@customer-portal/environments';
import { FileUploadToastHelper } from '@customer-portal/shared/helpers/toast';
import { FileUpload } from '@customer-portal/shared/models';

enum FileUploadErrors {
  Error_001 = 'audit.fileUpload.fileUploadWrongName',
  Error_002 = 'audit.fileUpload.fileUploadFailed',
  Error_003 = 'audit.fileUpload.fileUploadWrongSize',
  Error_004 = 'audit.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'audit.fileUpload.fileUploadGenericError',
}

const FILE_UPLOAD_SUCCESS = 'audit.fileUpload.fileUploadSuccess';

@Injectable({
  providedIn: 'root',
})
export class AuditFileUploadService {
  private toastHelper: FileUploadToastHelper;

  constructor(
    private http: HttpClient,
    private ts: TranslocoService,
    private messageSvc: MessageService,
  ) {
    this.toastHelper = new FileUploadToastHelper(this.ts, this.messageSvc);
  }

  sendFile(file: File, auditId: number): Observable<FileUpload> {
    return this.uploadDocument(file, auditId).pipe(
      tap((uploadStatus: FileUpload) => {
        this.toastHelper.generateToastMessageBasedOnFileUploadStatus(
          uploadStatus,
          FileUploadErrors,
          FILE_UPLOAD_SUCCESS,
        );
      }),
    );
  }

  private uploadDocument(file: File, auditId: number): Observable<FileUpload> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({ SKIP_LOADING: 'true' });

    const params = new HttpParams().set('AuditId', auditId);

    const { documentsApi } = environment;

    return this.http.post<FileUpload>(
      `${documentsApi}/AuditDocumentUpload`,
      formData,
      {
        headers,
        params,
      },
    );
  }
}
