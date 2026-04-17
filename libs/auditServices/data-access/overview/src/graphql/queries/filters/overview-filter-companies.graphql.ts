import { gql } from 'apollo-angular';

export const OVERVIEW_FILTER_COMPANIES_QUERY = gql`
  query GetOverviewFilterCompanies($services: [Int!], $sites: [Int!]) {
    certificateCompaniesFilter(services: $services, sites: $sites) {
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
