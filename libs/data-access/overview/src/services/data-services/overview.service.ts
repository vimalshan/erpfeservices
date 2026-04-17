import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { OverviewCardsDto, OverviewCardsListDto } from '../../dtos';
import {
  OVERVIEW_CARD_DATA_QUERY,
  OVERVIEW_CARD_DATA_QUERY_MODIFIED,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private readonly clientName = 'contact';
  private readonly pageSize = 4;

  constructor(private readonly apollo: Apollo) {}

  getOverviewCardData(
    pageNumber: number,
    companyFilter: number[],
    serviceFilter: number[],
    siteFilter: number[],
  ): Observable<OverviewCardsDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_CARD_DATA_QUERY,
        variables: {
          pageNumber,
          pageSize: this.pageSize,
          filter: {
            companies: companyFilter,
            sites: siteFilter,
            services: serviceFilter,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((results: any) => results.data.viewCertificationQuicklinkCard.data),
      );
  }

  getOverviewCardDataModified(
    companyFilter: number[],
    serviceFilter: number[],
    siteFilter: number[],
  ): Observable<OverviewCardsListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_CARD_DATA_QUERY_MODIFIED,
        variables: {
          filter: {
            companies: companyFilter,
            sites: siteFilter,
            services: serviceFilter,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results.data.viewCertificationQuicklinkCard));
  }
}
