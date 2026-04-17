import { gql } from 'apollo-angular';

export const NOTIFICATION_COMPANY_FILTER_QUERY = gql`
  query NotificationFilterCompanies(
    $categories: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    companiesFilter(
      categories: $categories
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
