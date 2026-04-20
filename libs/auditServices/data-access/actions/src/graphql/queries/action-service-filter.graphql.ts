import { gql } from 'apollo-angular';

export const ACTION_SERVICES_FILTER_QUERY = gql`
  query ActionFilterServices {
    actionServicesFilter {
      data {
        id
        name
      }
    }
  }
`;
