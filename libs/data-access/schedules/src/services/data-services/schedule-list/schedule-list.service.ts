import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { ScheduleExcelPayloadDto, ScheduleListDto } from '../../../dtos';
import { SCHEDULE_LIST_QUERY } from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ScheduleListService {
  private clientName = 'schedule';

  private readonly exportAuditSchedulesExcelUrl = `${environment.documentsApi}/ExportAuditSchedules`;

  constructor(
    private readonly apollo: Apollo,
    private readonly http: HttpClient,
  ) {}

  getScheduleList(): Observable<ScheduleListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_LIST_QUERY,
        variables: {
          calendarScheduleFilter: {},
        },
      })
      .pipe(map((results: any) => results.data.viewAuditSchedules));
  }

  exportSchedulesExcel(
    { filters }: ScheduleExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.http
      .post<{
        data: number[];
      }>(this.exportAuditSchedulesExcelUrl, filters, { headers })
      .pipe(map((response) => response.data));
  }
}
