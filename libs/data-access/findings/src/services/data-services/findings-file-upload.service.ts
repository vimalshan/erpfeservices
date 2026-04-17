import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';

import { environment } from '@customer-portal/environments';
import { FileUploadToastHelper } from '@customer-portal/shared/helpers/toast';
import { FileUpload } from '@customer-portal/shared/models';

enum FileUploadErrors {
  Error_001 = 'findings.fileUpload.fileUploadWrongName',
  Error_002 = 'findings.fileUpload.fileUploadFailed',
  Error_003 = 'findings.fileUpload.fileUploadWrongSize',
  Error_004 = 'findings.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'findings.fileUpload.fileUploadGenericError',
}

const FILE_UPLOAD_SUCCESS = 'findings.fileUpload.fileUploadSuccess';

@Injectable({
  providedIn: 'root',
})
export class FindingsFileUploadService {
  private toastHelper: FileUploadToastHelper;

  constructor(
    private http: HttpClient,
    private ts: TranslocoService,
    private messageSvc: MessageService,
  ) {
    this.toastHelper = new FileUploadToastHelper(this.ts, this.messageSvc);
  }

  sendFile(
    file: File,
    auditId: string,
    findingId: string,
  ): Observable<FileUpload> {
    return this.uploadDocument(file, auditId, findingId).pipe(
      tap((uploadStatus: FileUpload) => {
        this.toastHelper.generateToastMessageBasedOnFileUploadStatus(
          uploadStatus,
          FileUploadErrors,
          FILE_UPLOAD_SUCCESS,
        );
      }),
    );
  }

  private uploadDocument(
    file: File,
    auditId: string,
    findingId: string,
  ): Observable<FileUpload> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({ SKIP_LOADING: 'true' });

    const params = new HttpParams()
      .set('AuditId', auditId)
      .set('FindingId', findingId);

    const { documentsApi } = environment;

    return this.http.post<FileUpload>(
      `${documentsApi}/FindingDocumentUpload`,
      formData,
      {
        headers,
        params,
      },
    );
  }
}
