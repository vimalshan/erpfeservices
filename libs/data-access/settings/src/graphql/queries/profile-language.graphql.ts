import { gql } from 'apollo-angular';

export const PROFILE_LANGUAGE_QUERY = gql`
  query GetProfileLanguage {
    userProfile {
      data {
        portalLanguage
      }
      isSuccess
      errorCode
      message
    }
  }
`;
