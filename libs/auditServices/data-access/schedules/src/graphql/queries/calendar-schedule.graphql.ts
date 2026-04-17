import { gql } from 'apollo-angular';

export const CALENDAR_SCHEDULE_QUERY = gql`
  query GetAuditSchedulesForCalendar(
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
        __typename
      }
      isSuccess
      message
      errorCode
    }
  }
`;
