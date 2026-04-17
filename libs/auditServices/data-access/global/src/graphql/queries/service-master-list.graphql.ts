import { gql } from 'apollo-angular';

export const SERVICE_MASTER_LIST = gql`
  query GetServiceList {
    masterServiceList {
      data {
        id
        serviceName
        __typename
      }

      isSuccess
      message
      errorCode
      __typename
    }
  }
`;
