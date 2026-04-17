import { gql } from 'apollo-angular';

export const NOTIFICATION_SITES_FILTER_QUERY = gql`
  query NotificationFilterSites(
    $companies: [Int!]
    $categories: [Int!]
    $services: [Int!]
  ) {
    sitesFilter(
      companies: $companies
      categories: $categories
      services: $services
    ) {
      data {
        id
        label
        children {
          id
          label
          children {
            id
            label
          }
        }
      }
      errorCode
      isSuccess
      message
    }
  }
`;
