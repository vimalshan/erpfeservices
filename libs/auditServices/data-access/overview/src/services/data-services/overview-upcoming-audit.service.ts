import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { OverviewUpcomingAuditDto } from '../../dtos';
import { OVERVIEW_UPCOMING_AUDITS_QUERY } from '../../graphql';

@Injectable({
  providedIn: 'root',
})
export class OverviewUpcomingAuditService {
  clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getOverviewUpcomingAuditEvents(
    month: number,
    year: number,
  ): Observable<OverviewUpcomingAuditDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ getWidgetForUpcomingAudit: OverviewUpcomingAuditDto }>({
        query: OVERVIEW_UPCOMING_AUDITS_QUERY,
        variables: { month, year },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.getWidgetForUpcomingAudit));
  }
}
