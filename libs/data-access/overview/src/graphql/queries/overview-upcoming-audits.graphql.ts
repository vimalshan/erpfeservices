import { gql } from 'apollo-angular';

export const OVERVIEW_UPCOMING_AUDITS_QUERY = gql`
  query GetWidgetForUpcomingAudit($month: Int, $year: Int) {
    getWidgetForUpcomingAudit(month: $month, year: $year) {
      isSuccess
      message
      errorCode
      data {
        confirmed
        toBeConfirmed
        toBeConfirmedByDNV
      }
    }
  }
`;
