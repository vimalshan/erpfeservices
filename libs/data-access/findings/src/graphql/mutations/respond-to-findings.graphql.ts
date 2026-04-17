import { gql } from 'apollo-angular';

export const RESPOND_TO_FINDINGS_MUTATION = gql`
  mutation postLatestFindingResponse(
    $request: FindingLatestRespondRequestInput!
  ) {
    postLatestFindingResponse(request: $request) {
      isSuccess
      message
      errorCode
    }
  }
`;
