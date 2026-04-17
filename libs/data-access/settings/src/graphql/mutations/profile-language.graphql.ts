import { gql } from 'apollo-angular';

export const PROFILE_LANGUAGE_MUTATION = gql`
  mutation UpdateProfileLanguage($language: String!) {
    updateProfile(updateProfileRequest: { portalLanguage: $language }) {
      data {
        portalLanguage
      }
      isSuccess
      message
      errorCode
    }
  }
`;
