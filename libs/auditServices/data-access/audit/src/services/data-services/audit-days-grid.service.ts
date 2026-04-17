import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { AUDIT_DAYS_GRID_QUERY } from '../../graphql';

@Injectable()
export class AuditDaysGridService {
  private clientName = 'audit';

  constructor(private readonly apollo: Apollo) {}

  getAuditDaysGridData(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: AUDIT_DAYS_GRID_QUERY,
        variables: {
          startDate,
          endDate,
          companies,
          services,
          sites,
        },
      })
      .pipe(map((results: any) => results.data?.getAuditDaysPerSite));
  }
}
