import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { ActionsListDto } from '../../dtos';
import { ACTIONS_LIST_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class ActionsListService {
  private clientName = 'notification';

  constructor(private readonly apollo: Apollo) {}

  getActionsList(
    category: number[],
    company: number[],
    service: number[],
    site: number[],
    isHighPriority: boolean,
    pageNumber: number,
    pageSize: number,
  ): Observable<ActionsListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: ACTIONS_LIST_QUERY,
        fetchPolicy: 'no-cache',
        variables: {
          category,
          company,
          service,
          site,
          isHighPriority,
          pageNumber,
          pageSize,
        },
      })
      .pipe(map((results: any) => results?.data?.actions?.data));
  }
}
