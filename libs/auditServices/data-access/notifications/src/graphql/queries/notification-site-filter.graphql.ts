import { gql } from 'apollo-angular';

export const NOTIFICATION_SITES_FILTER_QUERY = gql`
  query NotificationFilterSites {
    sitesFilter {
      data {
        id
        name
      }
    }
  }
`;
