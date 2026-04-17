import { gql } from 'apollo-angular';

export const NOTIFICATIONS_COUNT_QUERY = gql`
  query InformationCount {
    informationCount {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
