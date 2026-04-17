import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  NotificationResponseFilterDto,
  NotificationSitesFilterDto,
} from '../../../dtos';
import {
  NOTIFICATION_CATEGORY_FILTER_QUERY,
  NOTIFICATION_COMPANY_FILTER_QUERY,
  NOTIFICATION_SERVICES_FILTER_QUERY,
  NOTIFICATION_SITES_FILTER_QUERY,
} from '../../../graphql';

@Injectable({
  providedIn: 'root',
})
export class NotificationFilterService {
  clientName = 'notification';

  constructor(private readonly apollo: Apollo) {}

  getNotificationCategory(): Observable<NotificationResponseFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ categoriesFilter: NotificationResponseFilterDto }>({
        query: NOTIFICATION_CATEGORY_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response: any) => response.data.categoriesFilter));
  }

  getNotificationServices(
    categories: string[] = [],
    companies: string[] = [],
    sites: string[] = [],
  ): Observable<NotificationResponseFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ servicesFilter: NotificationResponseFilterDto }>({
        query: NOTIFICATION_SERVICES_FILTER_QUERY,
        variables: {
          categories,
          companies,
          sites,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.servicesFilter));
  }

  getNotificationCompany(
    categories: string[] = [],
    services: string[] = [],
    sites: string[] = [],
  ): Observable<NotificationResponseFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ companiesFilter: NotificationResponseFilterDto }>({
        query: NOTIFICATION_COMPANY_FILTER_QUERY,
        variables: { categories, services, sites },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.companiesFilter));
  }

  getNotificationSites(
    companies: number[] = [],
    categories: number[] = [],
    services: number[] = [],
  ): Observable<NotificationSitesFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ sitesFilter: NotificationSitesFilterDto }>({
        query: NOTIFICATION_SITES_FILTER_QUERY,
        variables: {
          companies,
          categories,
          services,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.sitesFilter));
  }
}
