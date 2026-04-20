import { gql } from 'apollo-angular';

export const ACTION_COMPANY_FILTER_QUERY = gql`
  query ActionFilterCompanies {
    actionCompaniesFilter {
      data {
        id
        name
      }
    }
  }
`;
