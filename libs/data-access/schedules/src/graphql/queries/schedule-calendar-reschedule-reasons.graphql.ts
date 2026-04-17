import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY = gql`
  query GetScheduleCalendarRescheduleReasons {
    reScheduleReasons {
      data {
        id
        reasonDescription
      }
      isSuccess
      message
      errorCode
    }
  }
`;
