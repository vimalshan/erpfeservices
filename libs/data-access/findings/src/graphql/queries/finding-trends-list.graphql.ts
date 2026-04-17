import { gql } from 'apollo-angular';

export const FINDING_TRENDS_LIST_QUERY = gql`
  query GetFindingTrendsList(
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    trendList(
      filters: { companies: $companies, services: $services, sites: $sites }
    ) {
      data {
        data {
          location
          currentYear
          lastYear
          yearBeforeLast
          yearMinus3
        }
        children {
          data {
            location
            currentYear
            lastYear
            yearBeforeLast
            yearMinus3
          }
          children {
            data {
              location
              currentYear
              lastYear
              yearBeforeLast
              yearMinus3
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
