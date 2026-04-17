import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { ScheduleStatusTypes } from '../../../constants';
import {
  ScheduleCalendarInviteDto,
  ScheduleCalendarRescheduleReasonDto,
} from '../../../dtos';
import {
  SCHEDULE_CALENDAR_CONFIRM_MUTATION,
  SCHEDULE_CALENDAR_INVITE_QUERY,
  SCHEDULE_CALENDAR_RESCHEDULE_MUTATION,
  SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
  SCHEDULE_LIST_QUERY,
} from '../../../graphql';
import { ConfirmProposedSchedule, RescheduleAudit } from '../../../models';

@Injectable({ providedIn: 'root' })
export class ScheduleCalendarActionService {
  private clientName = 'schedule';

  constructor(private readonly apollo: Apollo) {}

  getScheduleCalendarAddToCalendar(
    siteAuditId: number,
  ): Observable<ScheduleCalendarInviteDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: true,
          siteAuditId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.addToCalender));
  }

  getScheduleCalendarShareInvite(
    siteAuditId: number,
  ): Observable<ScheduleCalendarInviteDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: false,
          siteAuditId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.addToCalender));
  }

  getScheduleCalendarRescheduleReasons(): Observable<ScheduleCalendarRescheduleReasonDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
      })
      .pipe(map((results: any) => results?.data?.reScheduleReasons));
  }

  editScheduleCalendarReschedule(
    additionalComments: string,
    rescheduleDate: Date,
    rescheduleReason: string,
    siteAuditId: number,
    weekNumber: string,
  ) {
    return this.apollo
      .use(this.clientName)
      .mutate<{ rescheduleAudit: RescheduleAudit }>({
        mutation: SCHEDULE_CALENDAR_RESCHEDULE_MUTATION,
        variables: {
          additionalComments,
          rescheduleDate,
          rescheduleReason,
          siteAuditId,
          weekNumber,
        },
        update: (cache) => {
          try {
            const existing: any = cache.readQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { calendarScheduleFilter: {} },
            });
            if (!existing || !existing.viewAuditSchedules?.data) return;

            const updatedData = existing.viewAuditSchedules.data.map(
              (s: any) =>
                s.siteAuditId === siteAuditId
                  ? { ...s, status: ScheduleStatusTypes.ToBeConfirmedByDNV }
                  : s,
            );

            cache.writeQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { calendarScheduleFilter: {} },
              data: {
                viewAuditSchedules: {
                  ...existing.viewAuditSchedules,
                  data: updatedData,
                },
              },
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
              'Error updating schedule reschedule in cache:',
              error,
            );
          }
        },
      })
      .pipe(map((res) => res.data?.rescheduleAudit));
  }

  editScheduleCalendarConfirm(siteAuditId: number) {
    return this.apollo
      .use(this.clientName)
      .mutate<{ confirmProposedSchedule: ConfirmProposedSchedule }>({
        mutation: SCHEDULE_CALENDAR_CONFIRM_MUTATION,
        variables: {
          siteAuditId,
        },
        update: (cache) => {
          try {
            const existing: any = cache.readQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { calendarScheduleFilter: {} },
            });
            if (!existing || !existing.viewAuditSchedules?.data) return;

            const updatedData = existing.viewAuditSchedules.data.map(
              (s: any) =>
                s.siteAuditId === siteAuditId
                  ? { ...s, status: ScheduleStatusTypes.Confirmed }
                  : s,
            );

            cache.writeQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { calendarScheduleFilter: {} },
              data: {
                viewAuditSchedules: {
                  ...existing.viewAuditSchedules,
                  data: updatedData,
                },
              },
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
              'Error updating schedule confirmation in cache:',
              error,
            );
          }
        },
      })
      .pipe(map((res) => res.data?.confirmProposedSchedule));
  }
}
