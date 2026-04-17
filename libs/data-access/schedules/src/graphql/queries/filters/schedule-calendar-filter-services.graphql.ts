import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_FILTER_SERVICES = gql`
  query GetScheduleCalendarFilterServices(
    $companies: [Int!]
    $sites: [Int!]
    $statuses: [Int!]
  ) {
    calendarServicesFilter(
      companies: $companies
      sites: $sites
      statuses: $statuses
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
