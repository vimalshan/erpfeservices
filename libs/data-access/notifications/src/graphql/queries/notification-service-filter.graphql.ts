import { gql } from 'apollo-angular';

export const NOTIFICATION_SERVICES_FILTER_QUERY = gql`
  query NotificationFilterservices(
    $companies: [Int!]
    $categories: [Int!]
    $sites: [Int!]
  ) {
    servicesFilter(
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
