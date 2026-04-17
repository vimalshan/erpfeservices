import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_FILTER_STATUSES = gql`
  query GetScheduleCalendarFilterStatuses(
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    calendarStatusesFilter(
      companies: $companies
      services: $services
      sites: $sites
    ) {
      data {
        id
        label
      }
      isSuccess
      message
      errorCode
    }
  }
`;
