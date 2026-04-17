import { gql } from 'apollo-angular';

export const ACTIONS_COUNT_QUERY = gql`
  query ActionsCount {
    actionsCount {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
