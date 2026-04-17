import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { BaseApolloService } from '@customer-portal/core';
import { environment } from '@customer-portal/environments';

import { AuditExcelPayloadDto, AuditListDto } from '../../dtos';
import { AUDIT_LIST_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class AuditListService extends BaseApolloService {
  private clientName = 'audit';

  private readonly exportAuditExcelUrl = `${environment.documentsApi}/ExportAudits`;

  constructor(
    apollo: Apollo,
    private http: HttpClient,
  ) {
    super(apollo);
  }

  getAuditList(): Observable<AuditListDto> {
    const fieldName =
      this.getQueryRootFieldName(AUDIT_LIST_QUERY) || 'viewAudits';

    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_LIST_QUERY,
      })
      .pipe(
        map((result: any) => {
          if (
            result === undefined ||
            result?.data === undefined ||
            result?.errors ||
            result.data?.viewAudits?.isSuccess === false
          ) {
            this.evictFromCache(this.clientName, fieldName);
          }

          return result.data?.viewAudits;
        }),
        catchError((err) =>
          of({
            isSuccess: false,
            data: [],
            errorCode: '',
            message: err.message,
            __typename: 'AuditListDto',
          } as AuditListDto),
        ),
      );
  }

  exportAuditsExcel(
    { filters }: AuditExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.http
      .post<{ data: number[] }>(this.exportAuditExcelUrl, filters, { headers })
      .pipe(map((response) => response.data));
  }
}
