import { gql } from 'apollo-angular';

export const ACTION_SERVICES_FILTER_QUERY = gql`
  query ActionFilterServices(
    $companies: [Int!]
    $categories: [Int!]
    $sites: [Int!]
  ) {
    actionServicesFilter(
      companies: $companies
      categories: $categories
      sites: $sites
    ) {
      data {
        id
        label
      }
      isSuccess
      message
      errorCode
    }
  }
`;
