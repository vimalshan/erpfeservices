import { gql } from 'apollo-angular';

export const NOTIFICATION_CATEGORY_FILTER_QUERY = gql`
  query NotificationFilterCategories(
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    categoriesFilter(
      companies: $companies
      services: $services
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
