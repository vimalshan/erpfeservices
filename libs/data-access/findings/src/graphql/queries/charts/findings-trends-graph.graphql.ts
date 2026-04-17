import { gql } from 'apollo-angular';

export const FINDINGS_TRENDS_GRAPH_QUERY = gql`
  query GetFindingsTrendsGraphData(
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    findingsByCategory(
      companies: $companies
      services: $services
      sites: $sites
    ) {
      data {
        categories {
          categoryName
          findings {
            count
            year
          }
        }
      }
      errorCode
      isSuccess
      message
    }
  }
`;
