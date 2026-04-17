import { gql } from 'apollo-angular';

export const ACTION_COMPANY_FILTER_QUERY = gql`
  query ActionFilterCompanies(
    $categories: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    actionCompaniesFilter(
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
