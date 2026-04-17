import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';

import { FINDING_RESPONSE_HISTORY_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class FindingResponseHistoryService {
  private clientName = 'finding';

  constructor(private readonly apollo: Apollo) {}

  getFindingResponseHistory(findingNumber: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_RESPONSE_HISTORY_QUERY,
        variables: {
          findingNumber,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result.data.viewPreviousResponses));
  }
}
