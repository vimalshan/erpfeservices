import { gql } from 'apollo-angular';

export const NOTIFICATION_CATEGORY_FILTER_QUERY = gql`
  query NotificationFilterCategories {
    categoriesFilter {
      data {
        id
        name
      }
    }
  }
`;
