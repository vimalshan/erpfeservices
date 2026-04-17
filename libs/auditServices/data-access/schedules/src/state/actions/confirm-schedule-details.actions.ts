import { ScheduleCalendarActionLocationTypes } from '../../constants';
import { CalendarDetailsModel } from '../../models';

export class SwitchCanUploadData {
  static readonly type =
    '[Confirm Schedule Details] Switch Can Upload Data Flag';

  constructor(public canUploadData: boolean) {}
}

export class LoadCalendarDetails {
  static readonly type = '[Confirm Schedule Details] Load Calendar Details';

  constructor(
    public scheduleId: number,
    public location: ScheduleCalendarActionLocationTypes,
  ) {}
}

export class LoadCalendarDetailsSuccess {
  static readonly type =
    '[Confirm Schedule Details] Load Calendar Details Success';

  constructor(public calendarDetails: CalendarDetailsModel) {}
}
