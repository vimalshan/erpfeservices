import { gql } from 'apollo-angular';

export const PROFILE_QUERY = gql`
  query UserProfile {
    userProfile {
      data {
        firstName
        lastName
        displayName
        country
        countryCode
        region
        email
        phone
        communicationLanguage
        jobTitle
        portalLanguage
        veracityId
        accessLevel {
          roleLevel
          roleName
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
