import { gql } from 'apollo-angular';

export const AUDIT_DAYS_DOUGHNUT_CHART_QUERY = gql`
  query GetAuditDaysByService(
    $filters: AuditDaysbyServicePieChartFiltersInput
  ) {
    auditDaysbyServicePieChart(filters: $filters) {
      data {
        pieChartData {
          auditDays
          auditpercentage
          serviceName
        }
        totalServiceAuditsDayCount
      }
      errorCode
      isSuccess
      message
    }
  }
`;
