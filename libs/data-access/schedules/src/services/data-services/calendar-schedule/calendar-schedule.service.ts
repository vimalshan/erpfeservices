import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  CalendarScheduleDto,
  CalendarSchedulePayloadDto,
  ScheduleCalendarFilterDto,
} from '../../../dtos';
import {
  CALENDAR_SCHEDULE_QUERY,
  SCHEDULE_CALENDAR_FILTER_COMPANIES,
  SCHEDULE_CALENDAR_FILTER_SERVICES,
  SCHEDULE_CALENDAR_FILTER_SITES,
  SCHEDULE_CALENDAR_FILTER_STATUSES,
} from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class CalendarScheduleService {
  private clientName = 'schedule';

  constructor(private readonly apollo: Apollo) {}

  getCalendarSchedule(
    calendarScheduleParams: CalendarSchedulePayloadDto,
  ): Observable<CalendarScheduleDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: CALENDAR_SCHEDULE_QUERY,
        variables: {
          calendarScheduleFilter: calendarScheduleParams,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.viewAuditSchedules));
  }

  getScheduleCalendarFilterCompanies(
    services: number[],
    sites: number[],
    statuses: number[],
  ): Observable<ScheduleCalendarFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_FILTER_COMPANIES,
        variables: {
          services,
          sites,
          statuses,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.calendarCompaniesFilter));
  }

  getScheduleCalendarFilterServices(
    companies: number[],
    sites: number[],
    statuses: number[],
  ): Observable<ScheduleCalendarFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_FILTER_SERVICES,
        variables: {
          companies,
          sites,
          statuses,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.calendarServicesFilter));
  }

  getScheduleCalendarFilterSites(
    companies: number[],
    services: number[],
    statuses: number[],
  ): Observable<ScheduleCalendarFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_FILTER_SITES,
        variables: {
          companies,
          services,
          statuses,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.calendarSitesFilter));
  }

  getScheduleCalendarFilterStatuses(
    companies: number[],
    services: number[],
    sites: number[],
  ): Observable<ScheduleCalendarFilterDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_FILTER_STATUSES,
        variables: {
          companies,
          services,
          sites,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.calendarStatusesFilter));
  }
}
