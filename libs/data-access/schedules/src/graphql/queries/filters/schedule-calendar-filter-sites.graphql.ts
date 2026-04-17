import { gql } from 'apollo-angular';

export const SCHEDULE_CALENDAR_FILTER_SITES = gql`
  query GetScheduleCalendarFilterSites(
    $companies: [Int!]
    $services: [Int!]
    $statuses: [Int!]
  ) {
    calendarSitesFilter(
      companies: $companies
      services: $services
      statuses: $statuses
    ) {
      data {
        id
        label
        children {
          id
          label
          children {
            id
            label
          }
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;
