import { gql } from 'apollo-angular';

export const OVERVIEW_CARD_DATA_QUERY_MODIFIED = gql`
  query GetOverviewCardData($filter: QuickLinkCardRequestInput!) {
    viewCertificationQuicklinkCard(filter: $filter) {
      data {
        data {
          serviceId
          serviceName
          yearData {
            year
            values {
              count
              seq
              statusValue
              totalCount
            }
          }
        }
        totalItems
      }
      isSuccess
      message
      errorCode
    }
  }
`;

export const OVERVIEW_CARD_DATA_QUERY = gql`
  query GetOverviewCardData(
    $pageNumber: Int!
    $pageSize: Int!
    $filter: QuickLinkCardRequestInput!
  ) {
    viewCertificationQuicklinkCard(
      pageNumber: $pageNumber
      pageSize: $pageSize
      filter: $filter
    ) {
      data {
        currentPage
        data {
          serviceId
          serviceName
          yearData {
            year
            values {
              count
              seq
              statusValue
              totalCount
            }
          }
        }
        totalItems
        totalPages
      }
      isSuccess
      message
      errorCode
    }
  }
`;
