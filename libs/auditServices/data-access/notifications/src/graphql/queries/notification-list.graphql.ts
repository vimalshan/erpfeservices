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
        currentPage
        items {
          createdTime
          infoId
          message
          language
          notificationCategory
          readStatus
          subject
          entityType
          entityId
          snowLink
        }
        totalItems
        totalPages
      }
      errorCode
      isSuccess
      message
    }
  }
`;
