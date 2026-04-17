import { gql } from 'apollo-angular';

export const ACTION_CATEGORY_FILTER_QUERY = gql`
  query ActionFilterCategories(
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    actionCategoriesFilter(
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
