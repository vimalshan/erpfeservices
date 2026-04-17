import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_CONFIRM_MUTATION = gql`
  mutation UpdateScheduleCalendarConfirm($siteAuditId: Int!) {
    confirmProposedSchedule(siteAuditId: $siteAuditId) {
      data
      isSuccess
      message
      errorCode
    }
  }
`;
