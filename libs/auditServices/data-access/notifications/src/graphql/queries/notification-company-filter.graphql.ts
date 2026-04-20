import { gql } from 'apollo-angular';

export const NOTIFICATION_COMPANY_FILTER_QUERY = gql`
  query NotificationFilterCompanies {
    companiesFilter {
      data {
        id
        name
      }
    }
  }
`;
