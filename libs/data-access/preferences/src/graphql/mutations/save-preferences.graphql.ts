import { gql } from 'apollo-angular';

export const SAVE_PREFERENCES_MUTATION = gql`
  mutation savePreferences($preferenceRequest: SavePreferenceRequestInput!) {
    preferences(preferenceRequest: $preferenceRequest) {
      isSuccess
      message
      errorCode
    }
  }
`;
