import { gql } from 'apollo-angular';

export const SETTINGS_USER_VALIDATION_QUERY = gql`
  query GetUserValidation {
    validateUser {
      data {
        userIsActive
        termsAcceptanceRedirectUrl
        policySubCode
        isSuaadhyaUser
        userEmail
        veracityId
        portalLanguage
        isAdmin
      }
      errorCode
      isSuccess
      message
    }
  }
`;
