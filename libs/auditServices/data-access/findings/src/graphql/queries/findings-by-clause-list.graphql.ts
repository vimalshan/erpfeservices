import { gql } from 'apollo-angular';

export const FINDINGS_BY_CLAUSE_LIST_QUERY = gql`
  query GetFindingsByClauseList(
    $filters: FindingsFilterRequestClauseListInput!
  ) {
    findingsByClauseList(filters: $filters) {
      data {
        data {
          name
          totalCount
          categoryCounts {
            key
            value
          }
        }
        children {
          data {
            name
            totalCount
            categoryCounts {
              key
              value
            }
          }
          children {
            data {
              name
              totalCount
              categoryCounts {
                key
                value
              }
            }
          }
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
