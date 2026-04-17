import { gql } from 'apollo-angular';

export const LATEST_FINDING_RESPONSES_QUERY = gql`
  query getLatestFindingResponse($findingNumber: String!) {
    getLatestFindingResponse(findingNumber: $findingNumber) {
      isSuccess
      data {
        rootCause
        correctiveAction
        correction
        isSubmitToDnv
        updatedOn
        isDraft
        respondId
      }
      errorCode
      message
    }
  }
`;
