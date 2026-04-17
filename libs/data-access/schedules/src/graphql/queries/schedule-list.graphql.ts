import { gql } from 'apollo-angular';

export const SCHEDULE_LIST_QUERY = gql`
  query GetAuditSchedules(
    $calendarScheduleFilter: CalendarScheduleFilterInput!
  ) {
    viewAuditSchedules(calendarScheduleFilter: $calendarScheduleFilter) {
      data {
        siteAuditId
        startDate
        endDate
        status
        serviceIds
        siteId
        auditType
        leadAuditor
        siteRepresentatives
        companyId
        auditID
        reportingCountry
        projectNumber
        accountDNVId
      }
      isSuccess
      message
      errorCode
    }
  }
`;
