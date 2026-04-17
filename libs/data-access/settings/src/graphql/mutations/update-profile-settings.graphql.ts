import { gql } from 'apollo-angular';

export const PROFILE_SETTINGS_MUTATION = gql`
  mutation UpdateProfileSettings(
    $communicationLanguage: String!
    $jobTitle: String!
  ) {
    updateProfile(
      updateProfileRequest: {
        communicationLanguage: $communicationLanguage
        jobTitle: $jobTitle
      }
    ) {
      data {
        communicationLanguage
        jobTitle
      }
      isSuccess
      message
      errorCode
    }
  }
`;
