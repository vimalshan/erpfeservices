import { gql } from 'apollo-angular';

export const OPEN_FINDINGS_GRAPH_QUERY = gql`
  query getOpenFindingsChartViewData(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $sites: [Int!]
    $services: [Int!]
    $period: String!
    $responsetype: String
  ) {
    getOpenFindingschartviewData(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      sites: $sites
      services: $services
      period: $period
      responsetype: $responsetype
    ) {
      data {
        services {
          service
          categories {
            category
            count
          }
        }
      }
      errorCode
      isSuccess
      message
    }
  }
`;
