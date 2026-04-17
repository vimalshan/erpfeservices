import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  OverviewCompanyServiceSiteFilterData,
  OverviewFilterDto,
} from '../../dtos';
import {
  OVERVIEW_FILTER_COMPANIES_QUERY,
  OVERVIEW_FILTER_QUERY,
  OVERVIEW_FILTER_SERVICES_QUERY,
  OVERVIEW_FILTER_SITES_QUERY,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class OverviewFilterService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getOverviewFilters(): Observable<OverviewCompanyServiceSiteFilterData> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_FILTER_QUERY,
        variables: {},
      })
      .pipe(
        map((results: any) => results?.data?.overviewCompanyServiceSiteFilter),
      );
  }

  getOverviewFilterCompanies(
    services: number[],
    sites: number[],
  ): Observable<OverviewFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_FILTER_COMPANIES_QUERY,
        variables: {
          services,
          sites,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.certificateCompaniesFilter));
  }

  getOverviewFilterServices(
    companies: number[],
    sites: number[],
  ): Observable<OverviewFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_FILTER_SERVICES_QUERY,
        variables: {
          companies,
          sites,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.certificateServicesFilter));
  }

  getOverviewFilterSites(
    companies: number[],
    services: number[],
  ): Observable<OverviewFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: OVERVIEW_FILTER_SITES_QUERY,
        variables: {
          companies,
          services,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.certificationSitesFilter));
  }
}
