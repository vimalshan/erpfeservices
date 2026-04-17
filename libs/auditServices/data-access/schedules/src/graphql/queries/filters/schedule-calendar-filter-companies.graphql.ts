import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_FILTER_COMPANIES = gql`
  query GetScheduleCalendarFilterCompanies(
    $services: [Int!]
    $sites: [Int!]
    $statuses: [Int!]
  ) {
    calendarCompaniesFilter(
      services: $services
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
