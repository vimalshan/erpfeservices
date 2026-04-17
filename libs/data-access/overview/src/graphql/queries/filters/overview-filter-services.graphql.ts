import { gql } from 'apollo-angular';

export const OVERVIEW_FILTER_SERVICES_QUERY = gql`
  query GetOverviewFilterServices($companies: [Int!], $sites: [Int!]) {
    certificateServicesFilter(companies: $companies, sites: $sites) {
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
