import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_INVITE_QUERY = gql`
  query GetScheduleCalendarInvite(
    $isAddToCalender: Boolean!
    $siteAuditId: Int!
  ) {
    addToCalender(
      isAddToCalender: $isAddToCalender
      siteAuditId: $siteAuditId
    ) {
      data {
        icsResponse
        calendarAttributes {
          auditType
          endDate
          leadAuditor
          service
          site
          siteAddress
          siteRepresentative
          startDate
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
