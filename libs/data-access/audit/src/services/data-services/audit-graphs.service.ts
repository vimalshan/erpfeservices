import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  AUDIT_DAYS_BAR_CHART_QUERY,
  AUDIT_DAYS_DOUGHNUT_CHART_QUERY,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class AuditGraphsService {
  private clientName = 'audit';

  constructor(private readonly apollo: Apollo) {}

  getAuditDaysDoughnutGraphData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_DAYS_DOUGHNUT_CHART_QUERY,
        variables: {
          filters: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        },
      })
      .pipe(map((results: any) => results.data?.auditDaysbyServicePieChart));
  }

  getAuditDaysBarGraphData(
    startDate: Date,
    endDate: Date,
    companyFilter: number[],
    serviceFilter: number[],
    siteFilter: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_DAYS_BAR_CHART_QUERY,
        variables: {
          startDate,
          endDate,
          companyFilter,
          serviceFilter,
          siteFilter,
        },
      })
      .pipe(map((results: any) => results.data?.getAuditDaysByMonthAndService));
  }
}
