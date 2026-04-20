import { gql } from 'apollo-angular';

export const NOTIFICATIONS_DETAILS_QUERY = gql`
  query Notifications(
    $category: [Int!]
    $company: [Int!]
    $service: [Int!]
    $site: [Int!]
    $pageNumber: Int!
    $pageSize: Int!
  ) {
    notifications(
      category: $category
      company: $company
      service: $service
      site: $site
      pageNumber: $pageNumber
      pageSize: $pageSize
    ) {
      data {
        id
        title
        message
        category
        createdDate
        isRead
      }
      pageInfo {
        pageNumber
        pageSize
        totalCount
      }
    }
  }
`;
