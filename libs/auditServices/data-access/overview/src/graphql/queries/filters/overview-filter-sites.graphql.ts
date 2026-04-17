import { gql } from 'apollo-angular';

export const OVERVIEW_FILTER_SITES_QUERY = gql`
  query GetOverviewFilterSites($companies: [Int!], $services: [Int!]) {
    certificationSitesFilter(companies: $companies, services: $services) {
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
      isSuccess
      message
      errorCode
    }
  }
`;
