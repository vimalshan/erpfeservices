import { gql } from 'apollo-angular';

export const FINDINGS_BY_SITE_LIST_QUERY = gql`
  query GetFindingBySite(
    $companies: [Int!]
    $country: [Int!]
    $startDate: String
    $endDate: String
    $services: [Int!]
  ) {
    getFindingBySite(
      companies: $companies
      country: $country
      startDate: $startDate
      endDate: $endDate
      services: $services
    ) {
      data {
        data {
          id
          name
          majorCount
          minorCount
          observationCount
          toImproveCount
          totalCount
        }
        children {
          data {
            name
            majorCount
            minorCount
            observationCount
            toImproveCount
            totalCount
          }
          children {
            data {
              id
              name
              majorCount
              minorCount
              observationCount
              toImproveCount
              totalCount
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
