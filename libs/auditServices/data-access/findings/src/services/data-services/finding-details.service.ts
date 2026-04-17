import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';

import { FindingResponsesPayloadDto } from '../../dtos';
import {
  FINDING_DETAILS_QUERY,
  LATEST_FINDING_RESPONSES_QUERY,
  MANAGE_FINDING_DETAILS_QUERY,
  RESPOND_TO_FINDINGS_MUTATION,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class FindingDetailsService {
  private clientName = 'finding';

  constructor(private readonly apollo: Apollo) {}

  getFindingDetails(findingNumber: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: FINDING_DETAILS_QUERY,
        variables: {
          findingNumber,
        },
      })
      .pipe(map((result: any) => result.data.viewFindingDetails));
  }

  getManageFindingDetails(findingNumber: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: MANAGE_FINDING_DETAILS_QUERY,
        variables: {
          findingNumber,
        },
      })
      .pipe(map((result: any) => result.data.viewManageFinding));
  }

  respondToFindings({ request }: FindingResponsesPayloadDto) {
    return this.apollo.use(this.clientName).mutate({
      mutation: RESPOND_TO_FINDINGS_MUTATION,
      variables: {
        request,
      },
    });
  }

  getLatestFindingResponses(findingNumber: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: LATEST_FINDING_RESPONSES_QUERY,
        variables: {
          findingNumber,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results.data?.getLatestFindingResponse));
  }
}
