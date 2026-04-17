import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_RESCHEDULE_MUTATION = gql`
  mutation UpdateScheduleCalendarReschedule(
    $additionalComments: String
    $rescheduleDate: DateTime!
    $rescheduleReason: String!
    $siteAuditId: Int!
    $weekNumber: String!
  ) {
    rescheduleAudit(
      additionalComments: $additionalComments
      rescheduleDate: $rescheduleDate
      rescheduleReason: $rescheduleReason
      siteAuditId: $siteAuditId
      weekNumber: $weekNumber
    ) {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
