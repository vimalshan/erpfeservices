import { gql } from 'apollo-angular';

export const ACTION_SITES_FILTER_QUERY = gql`
  query ActionFilterSites(
    $companies: [Int!]
    $categories: [Int!]
    $services: [Int!]
  ) {
    actionSitesFilter(
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
