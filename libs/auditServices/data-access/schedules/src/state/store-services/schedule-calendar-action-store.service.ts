import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import {
  LoadScheduleCalendarAddToCalendar,
  LoadScheduleCalendarRescheduleReasons,
  LoadScheduleCalendarShareInvite,
  UpdateScheduleCalendarConfirm,
  UpdateScheduleCalendarReschedule,
} from '../actions';
import { ScheduleCalendarActionSelectors } from '../selectors/schedule-calendar-action.selectors';

@Injectable()
export class ScheduleCalendarActionStoreService {
  constructor(private store: Store) {}

  get rescheduleReasonList(): Signal<any[]> {
    return this.store.selectSignal(
      ScheduleCalendarActionSelectors.rescheduleReasonList,
    );
  }

  @Dispatch()
  loadScheduleCalendarAddToCalendar = (siteAuditId: number) =>
    new LoadScheduleCalendarAddToCalendar(siteAuditId);

  @Dispatch()
  loadScheduleCalendarShareInvite = (siteAuditId: number) =>
    new LoadScheduleCalendarShareInvite(siteAuditId);

  @Dispatch()
  loadScheduleCalendarRescheduleReasons = () =>
    new LoadScheduleCalendarRescheduleReasons();

  @Dispatch()
  updateScheduleCalendarReschedule = (
    additionalComments: string,
    rescheduleDate: Date,
    rescheduleReason: string,
    siteAuditId: number,
    weekNumber: string,
  ) =>
    new UpdateScheduleCalendarReschedule(
      additionalComments,
      rescheduleDate,
      rescheduleReason,
      siteAuditId,
      weekNumber,
    );

  @Dispatch()
  updateScheduleCalendarConfirm = (siteAuditId: number) =>
    new UpdateScheduleCalendarConfirm(siteAuditId);
}
