import { gql } from 'apollo-angular';

export const AUDIT_DAYS_GRID_QUERY = gql`
  query GetAuditDaysGrid(
    $startDate: String
    $endDate: String
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    getAuditDaysPerSite(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      services: $services
      sites: $sites
    ) {
      data {
        data {
          id
          name
          auditDays
          dataType
        }
        children {
          data {
            name
            auditDays
            dataType
          }
          children {
            data {
              id
              name
              auditDays
              dataType
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
