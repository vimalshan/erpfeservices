import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { OverviewFinancialStatusGraphWrapperDto } from '../../dtos';
import { OVERVIEW_FINANCIAL_STATUS_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class OverviewFinancialStatusService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getOverviewFinancialWidget(): Observable<OverviewFinancialStatusGraphWrapperDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_FINANCIAL_STATUS_QUERY,
        variables: {},
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data));
  }
}
