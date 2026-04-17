import { gql } from 'apollo-angular';

export const FINDING_RESPONSE_HISTORY_QUERY = gql`
  query findingResponseHistory($findingNumber: String!) {
    viewPreviousResponses(findingNumber: $findingNumber) {
      isSuccess
      data {
        auditorComments {
          commentsInPrimaryLanguage
          commentsInSecondaryLanguage
          responseCommentId
          updatedBy
          updatedOn
        }
        previousResponse {
          correctionInPrimaryLanguage
          correctionInSecondaryLanguage
          correctiveActionInPrimaryLanguage
          correctiveActionInSecondaryLanguage
          responseId
          rootCauseInPrimaryLanguage
          rootCauseInSecondaryLanguage
          updatedBy
          updatedOn
        }
      }
      errorCode
      message
    }
  }
`;
