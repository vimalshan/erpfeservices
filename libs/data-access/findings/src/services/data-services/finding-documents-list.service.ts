import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { FindingDocumentsListDto } from '../../dtos/finding-documents-list.dto';

@Injectable({ providedIn: 'root' })
export class FindingDocumentsListService {
  constructor(private readonly httpClient: HttpClient) {}

  getFindingDocumentsList(
    auditId: string,
    findingsId: string,
  ): Observable<FindingDocumentsListDto> {
    const { documentsApi } = environment;

    const query = `auditId=${auditId}&findingsId=${findingsId}`;
    const url = `${documentsApi}/FindingsDocumentList?${query}`;

    return this.httpClient.get<FindingDocumentsListDto>(url);
  }
}
