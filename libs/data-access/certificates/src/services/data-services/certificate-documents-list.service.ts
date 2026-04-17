import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { CertificateDocumentsListDto } from '../../dtos';

@Injectable({ providedIn: 'root' })
export class CertificateDocumentsListService {
  constructor(private readonly httpClient: HttpClient) {}

  getCertificateDocumentsList(
    certificateNumber: string,
    revisionNumber: number,
  ): Observable<CertificateDocumentsListDto> {
    const { documentsApi } = environment;

    const query = `certificateNumber=${certificateNumber}&RevisionNumber=${revisionNumber}`;
    const url = `${documentsApi}/CertificateDocuments?${query}`;

    return this.httpClient.get<CertificateDocumentsListDto>(url);
  }
}
