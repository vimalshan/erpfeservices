import { gql } from 'apollo-angular';

export const NOTIFICATION_SERVICES_FILTER_QUERY = gql`
  query NotificationFilterServices {
    servicesFilter {
      data {
        id
        name
      }
    }
  }
`;
