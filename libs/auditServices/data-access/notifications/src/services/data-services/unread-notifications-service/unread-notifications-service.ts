import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { UnreadNotificationCountDto } from '../../../dtos';
import { NOTIFICATIONS_COUNT_QUERY } from '../../../graphql';

@Injectable({
  providedIn: 'root',
})
export class UnreadNotificationsService {
  private clientName = 'notification';

  constructor(private readonly apollo: Apollo) {}

  getUnreadNotificationsCount(): Observable<UnreadNotificationCountDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: NOTIFICATIONS_COUNT_QUERY,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            SKIP_LOADING: 'true',
          },
        },
      })
      .pipe(map((results: any) => results?.data?.informationCount));
  }
}
