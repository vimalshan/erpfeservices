import { gql } from 'apollo-angular';

export const ACTIONS_LIST_QUERY = gql`
  query Actions(
    $category: [Int!]
    $service: [Int!]
    $company: [Int!]
    $site: [Int!]
    $isHighPriority: Boolean!
    $pageNumber: Int!
    $pageSize: Int!
  ) {
    actions(
      category: $category
      company: $company
      service: $service
      site: $site
      isHighPriority: $isHighPriority
      pageNumber: $pageNumber
      pageSize: $pageSize
    ) {
      data {
        action
        dueDate
        highPriority
        id
        message
        service
        site
        entityType
        entityId
        subject
      }
      pageInfo {
        pageNumber
        pageSize
        totalCount
      }
    }
  }
`;
