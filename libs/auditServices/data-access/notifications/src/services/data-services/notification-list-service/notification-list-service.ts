import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  NotificationListDto,
  NotificationResponseFilterDto,
  NotificationSitesFilterDto,
} from '../../../dtos';
import {
  NOTIFICATION_CATEGORY_FILTER_QUERY,
  NOTIFICATION_COMPANY_FILTER_QUERY,
  NOTIFICATION_SERVICES_FILTER_QUERY,
  NOTIFICATION_SITES_FILTER_QUERY,
  NOTIFICATIONS_DETAILS_QUERY,
  UPDATE_NOTIFICATION_READ_STATUS,
} from '../../../graphql';

@Injectable({
  providedIn: 'root',
})
export class NotificationListService {
  private clientName = 'notification';

  constructor(private readonly apollo: Apollo) {}

  getNotificationList(
    category: number[] = [],
    company: number[] = [],
    service: number[] = [],
    site: number[] = [],
    pageNumber = 1,
    pageSize = 10,
  ): Observable<NotificationListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: NOTIFICATIONS_DETAILS_QUERY,
        fetchPolicy: 'no-cache',
        variables: {
          category,
          company,
          service,
          site,
          pageNumber,
          pageSize,
        },
      })
      .pipe(map((results: any) => results?.data?.notifications));
  }

  updateNotification(id: number, userId: number = 0): Observable<boolean> {
    return this.apollo
      .use(this.clientName)
      .mutate({
        mutation: UPDATE_NOTIFICATION_READ_STATUS,
        variables: {
          notificationId: id,
          userId,
        },
      })
      .pipe(
        map(
          (results: any) =>
            results?.data?.markNotificationRead?.isRead ?? false,
        ),
      );
  }

  getNotificationCategory(
    _companies: number[],
    _services: number[],
    _sites: number[],
  ): Observable<NotificationResponseFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ categoriesFilter: NotificationResponseFilterDto }>({
        query: NOTIFICATION_CATEGORY_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response: any) => response.data.categoriesFilter));
  }

  getNotificationServices(
    _categories: number[],
    _companies: number[],
    _sites: number[],
  ): Observable<NotificationResponseFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ servicesFilter: NotificationResponseFilterDto }>({
        query: NOTIFICATION_SERVICES_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.servicesFilter));
  }

  getNotificationCompany(
    _categories: number[],
    _services: number[],
    _sites: number[],
  ): Observable<NotificationResponseFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ companiesFilter: NotificationResponseFilterDto }>({
        query: NOTIFICATION_COMPANY_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.companiesFilter));
  }

  getNotificationSites(
    _companies: number[],
    _categories: number[],
    _services: number[],
  ): Observable<NotificationSitesFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query<{ sitesFilter: NotificationSitesFilterDto }>({
        query: NOTIFICATION_SITES_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data.sitesFilter));
  }
}
