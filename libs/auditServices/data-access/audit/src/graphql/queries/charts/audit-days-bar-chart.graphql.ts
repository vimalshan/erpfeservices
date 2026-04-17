import { gql } from 'apollo-angular';

export const AUDIT_DAYS_BAR_CHART_QUERY = gql`
  query GetAuditDaysByMonthAndService(
    $startDate: String
    $endDate: String
    $companyFilter: [Int!]
    $serviceFilter: [Int!]
    $siteFilter: [Int!]
  ) {
    getAuditDaysByMonthAndService(
      startDate: $startDate
      endDate: $endDate
      companyFilter: $companyFilter
      serviceFilter: $serviceFilter
      siteFilter: $siteFilter
    ) {
      data {
        chartData {
          month
          monthCount
          serviceData {
            auditDays
            serviceName
          }
        }
      }
      errorCode
      isSuccess
      message
    }
  }
`;
