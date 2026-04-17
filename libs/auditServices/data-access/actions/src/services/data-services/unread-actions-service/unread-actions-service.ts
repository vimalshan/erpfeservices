import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { UnreadActionsDto } from '../../../dtos/unread-actions-count.dto';
import { ACTIONS_COUNT_QUERY } from '../../../graphql';

@Injectable({
  providedIn: 'root',
})
export class UnreadActionsService {
  private clientName = 'notification';

  constructor(private readonly apollo: Apollo) {}

  getUnreadActionsCount(): Observable<UnreadActionsDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: ACTIONS_COUNT_QUERY,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            SKIP_LOADING: 'true',
          },
        },
      })
      .pipe(map((results: any) => results?.data));
  }
}
