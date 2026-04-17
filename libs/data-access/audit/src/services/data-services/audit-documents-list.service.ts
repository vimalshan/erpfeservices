import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { AuditDocumentsListDto } from '../../dtos';

@Injectable({ providedIn: 'root' })
export class AuditDocumentsListService {
  constructor(private readonly httpClient: HttpClient) {}

  getAuditDocumentsList(
    auditId: string,
    planAndReport: boolean,
    skipLoading?: boolean,
  ): Observable<AuditDocumentsListDto> {
    const { documentsApi } = environment;

    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    const query = `auditId=${auditId}&planAndReport=${planAndReport}`;
    const url = `${documentsApi}/AuditDocumentList?${query}`;

    return this.httpClient.get<AuditDocumentsListDto>(url, { headers });
  }
}
