import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { ActionFilterResponseDto, ActionSitesFilterDto } from '../../dtos';
import {
  ACTION_CATEGORY_FILTER_QUERY,
  ACTION_COMPANY_FILTER_QUERY,
  ACTION_SERVICES_FILTER_QUERY,
  ACTION_SITES_FILTER_QUERY,
} from '../../graphql';

@Injectable({
  providedIn: 'root',
})
export class ActionsFilterService {
  clientName = 'notification';

  constructor(private readonly apollo: Apollo) {}

  getActionFilterCategories(
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<ActionFilterResponseDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ actionCategoriesFilter: ActionFilterResponseDto }>({
        query: ACTION_CATEGORY_FILTER_QUERY,
        variables: {
          companies,
          services,
          sites,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response: any) => response.data.actionCategoriesFilter));
  }

  getActionFilterServices(
    _companies: number[],
    _categories: number[],
    _sites: number[],
  ): Observable<ActionFilterResponseDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ actionServicesFilter: ActionFilterResponseDto }>({
        query: ACTION_SERVICES_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.actionServicesFilter));
  }

  getActionFilterCompanies(
    _categories: number[],
    _services: number[],
    _sites: number[],
  ): Observable<ActionFilterResponseDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ actionCompaniesFilter: ActionFilterResponseDto }>({
        query: ACTION_COMPANY_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.actionCompaniesFilter));
  }

  getActionFilterSites(
    _companies: number[],
    _categories: number[],
    _services: number[],
  ): Observable<ActionSitesFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ actionSitesFilter: ActionSitesFilterDto }>({
        query: ACTION_SITES_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.actionSitesFilter));
  }
}
