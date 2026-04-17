import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';
import { getContentType } from '@customer-portal/shared/helpers/download';
import { FileUpload } from '@customer-portal/shared/models';

import { DocumentDeleteDto } from '../dtos/document-delete.dto';
import { DocType } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  constructor(private readonly httpClient: HttpClient) {}

  downloadDocument(
    documentId: number,
    fileName?: string,
    skipLoading?: boolean,
  ): Observable<HttpResponse<Blob>> {
    const { documentsApi } = environment;

    const query = `documentId=${documentId}`;
    const url = `${documentsApi}/download?${query}`;

    let headers = fileName
      ? new HttpHeaders({
          Accept: getContentType(fileName),
        })
      : new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.httpClient.get<Blob>(url, {
      observe: 'response',
      responseType: 'blob' as 'json',
      headers,
    });
  }

  deleteDocument(
    serviceName: string,
    serviceId: string,
    documentId: number,
  ): Observable<DocumentDeleteDto> {
    const { documentsApi } = environment;

    return this.httpClient.delete<DocumentDeleteDto>(
      `${documentsApi}/DeleteDocument?${serviceName}=${serviceId}&documentId=${documentId}`,
    );
  }

  uploadDocument(
    url: string,
    file: File,
    auditId: string,
    findingId?: string,
  ): Observable<FileUpload[]> {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    const headers = new HttpHeaders({ SKIP_LOADING: 'true' });

    const params = findingId
      ? this.uploadFindingDocumentParams(auditId, findingId)
      : this.uploadAuditDocumentParams(auditId);

    const { documentsApi } = environment;

    return this.httpClient.post<FileUpload[]>(
      `${documentsApi}${url}`,
      formData,
      {
        headers,
        params,
      },
    );
  }

  uploadAuditDocumentParams(auditId: string): HttpParams {
    return new HttpParams().set('AuditId', auditId);
  }

  uploadFindingDocumentParams(auditId: string, findingId: string): HttpParams {
    return new HttpParams().set('AuditId', auditId).set('FindingId', findingId);
  }

  downloadAllDocuments(
    ids: number[],
    docType: DocType,
    skipLoading?: boolean,
  ): Observable<HttpResponse<Blob>> {
    const { documentsApi } = environment;
    const url = `${documentsApi}/Bulkdownload?DocType=${docType}`;

    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.httpClient.post<Blob>(url, ids, {
      observe: 'response',
      responseType: 'blob' as 'json',
      headers,
    });
  }
}
