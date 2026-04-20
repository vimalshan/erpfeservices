import { gql } from 'apollo-angular';

export const ACTION_SITES_FILTER_QUERY = gql`
  query ActionFilterSites {
    actionSitesFilter {
      data {
        id
        name
      }
    }
  }
`;
