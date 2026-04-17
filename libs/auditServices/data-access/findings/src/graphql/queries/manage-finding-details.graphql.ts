import { gql } from 'apollo-angular';

export const MANAGE_FINDING_DETAILS_QUERY = gql`
  query GetManageFindingDetails($findingNumber: String!) {
    viewManageFinding(findingNumber: $findingNumber) {
      isSuccess
      data {
        category
        clauses
        descriptionInPrimaryLanguage
        descriptionInSecondaryLanguage
        focusAreas {
          focusAreaInPrimaryLanguage
          focusAreaInSecondaryLanguage
        }
        primaryLanguage
        secondaryLanguage
        titleInPrimaryLanguage
        titleInSecondaryLanguage
      }
      errorCode
      message
    }
  }
`;
