import { Selector } from '@ngxs/store';

import { ScheduleCalendarRescheduleReasonModel } from '../../models';
import {
  ScheduleCalendarActionState,
  ScheduleCalendarActionStateModel,
} from '../schedule-calendar-action.state';

export class ScheduleCalendarActionSelectors {
  @Selector([ScheduleCalendarActionSelectors._rescheduleReasonList])
  static rescheduleReasonList(
    rescheduleReasonList: ScheduleCalendarRescheduleReasonModel[],
  ): ScheduleCalendarRescheduleReasonModel[] {
    return rescheduleReasonList;
  }

  @Selector([ScheduleCalendarActionState])
  private static _rescheduleReasonList(
    state: ScheduleCalendarActionStateModel,
  ): ScheduleCalendarRescheduleReasonModel[] {
    return state?.rescheduleReasonList;
  }
}
