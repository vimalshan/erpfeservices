import {
  ScheduleCalendarInviteCalendarAttributesModel,
  ScheduleCalendarRescheduleReasonModel,
} from '../../models';

export class LoadScheduleCalendarAddToCalendar {
  static readonly type = '[Schedule Calendar Action] Add To Calendar';

  public constructor(public siteAuditId: number) {}
}

export class LoadScheduleCalendarAddToCalendarSuccess {
  static readonly type = '[Schedule Calendar Action] Add To Calendar Success';

  public constructor(public icsResponse: number[]) {}
}

export class LoadScheduleCalendarShareInvite {
  static readonly type = '[Schedule Calendar Action] Share Invite';

  public constructor(public siteAuditId: number) {}
}

export class LoadScheduleCalendarShareInviteSuccess {
  static readonly type = '[Schedule Calendar Action] Share Invite Success';

  public constructor(
    public icsResponse: number[],
    public calendarAttributes: ScheduleCalendarInviteCalendarAttributesModel,
  ) {}
}

export class LoadScheduleCalendarRescheduleReasons {
  static readonly type = '[Schedule Calendar Action] Reschedule Reasons';
}

export class LoadScheduleCalendarRescheduleReasonsSuccess {
  static readonly type =
    '[Schedule Calendar Action] Reschedule Reasons Success';

  public constructor(
    public rescheduleReasonList: ScheduleCalendarRescheduleReasonModel[],
  ) {}
}

export class UpdateScheduleCalendarReschedule {
  static readonly type = '[Schedule Calendar Action] Reschedule';

  public constructor(
    public additionalComments: string,
    public rescheduleDate: Date,
    public rescheduleReason: string,
    public siteAuditId: number,
    public weekNumber: string,
  ) {}
}

export class UpdateScheduleCalendarRescheduleSuccess {
  static readonly type = '[Schedule Calendar Action] Reschedule Success';

  public constructor(public siteAuditId: number) {}
}

export class UpdateScheduleCalendarRescheduleError {
  static readonly type = '[Schedule Calendar Action] Reschedule Error';
}

export class UpdateScheduleCalendarConfirm {
  static readonly type = '[Schedule Calendar Action] Confirm';

  public constructor(public siteAuditId: number) {}
}

export class UpdateScheduleCalendarConfirmSuccess {
  static readonly type = '[Schedule Calendar Action] Confirm Success';

  public constructor(public siteAuditId: number) {}
}

export class UpdateScheduleCalendarConfirmError {
  static readonly type = '[Schedule Calendar Action] Confirm Error';
}
