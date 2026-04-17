import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import {
  AuditFindingListDto,
  AuditFindingsExcelPayloadDto,
  SubAuditExcelPayloadDto,
} from '../../dtos';
import { SubAuditListDto } from '../../dtos/sub-audit-list.dto';
import {
  AUDIT_DETAILS_QUERY,
  AUDIT_FINDING_LIST_QUERY,
  AUDIT_SITES_LIST_QUERY,
  SUB_AUDIT_LIST_QUERY,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class AuditDetailsService {
  private auditClientName = 'audit';
  private findingClientName = 'finding';

  private readonly exportSubAuditExcelUrl = `${environment.documentsApi}/ExportSubAudits`;
  private readonly exportFindingExcelUrl = `${environment.documentsApi}/ExportFindings`;

  constructor(
    private readonly apollo: Apollo,
    private readonly http: HttpClient,
  ) {}

  getAuditFindingList(auditId: number): Observable<AuditFindingListDto> {
    return this.apollo
      .use(this.findingClientName)
      .query({
        query: AUDIT_FINDING_LIST_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((results: any) => results.data.viewFindings));
  }

  exportAuditFindingsExcel(
    { filters }: AuditFindingsExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.http
      .post<{
        data: number[];
      }>(this.exportFindingExcelUrl, filters, { headers })
      .pipe(map((response) => response.data));
  }

  getSubAuditList(auditId: number): Observable<SubAuditListDto> {
    return this.apollo
      .use(this.auditClientName)
      .query({
        query: SUB_AUDIT_LIST_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((results: any) => results.data.viewSubAudits));
  }

  exportSubAuditsExcel(
    payload: SubAuditExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    const url = `${this.exportSubAuditExcelUrl}?auditId=${payload.auditId}`;

    return this.http
      .post<{ data: number[] }>(url, payload.filters, { headers })
      .pipe(map((response) => response.data));
  }

  getAuditDetails(auditId: number) {
    return this.apollo
      .use(this.auditClientName)
      .query({
        query: AUDIT_DETAILS_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((result: any) => result.data.auditDetails));
  }

  getSitesList(auditId: number) {
    return this.apollo
      .use(this.auditClientName)
      .query({
        query: AUDIT_SITES_LIST_QUERY,
        variables: {
          auditId,
        },
      })
      .pipe(map((results: any) => results.data.viewSitesForAudit));
  }
}
