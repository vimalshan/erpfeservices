import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  CustomTreeNode,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { ScheduleListItemEnrichedDto } from '../../dtos';
import {
  CalendarScheduleParams,
  ScheduleCalendarFilterKey,
} from '../../models';

export class LoadScheduleListAndCalendarFilters {
  static readonly type =
    '[Schedule List Calendar] Load List and Calendar Filters';

  constructor(public params?: CalendarScheduleParams) {}
}

export class LoadScheduleListAndCalendarFiltersOnDateChange {
  static readonly type =
    '[Schedule List Calendar] Load List and Calendar Filters On Date Change';

  constructor(public params?: CalendarScheduleParams) {}
}

export class UpdateScheduleDateAndRecalculateSchedules {
  static readonly type =
    '[Schedule List Calendar] Update Date and Recalculate Schedules';

  constructor(
    public year: number,
    public month: number,
  ) {}
}

export class UpdateScheduleListCalendarScheduleMonth {
  static readonly type = '[Schedule List Calendar Schedule] Update Month';

  constructor(public month: number) {}
}

export class UpdateScheduleListCalendarScheduleYear {
  static readonly type = '[Schedule List Calendar Schedule] Update Year';

  constructor(public year: number) {}
}

export class LoadScheduleListCalendarSchedules {
  static readonly type = '[Schedule List Calendar] Load Schedules';
}

export class UpdateScheduleListCalendarFilterCompanies {
  static readonly type = '[Schedule List Calendar] Update Selected Companies';

  constructor(public data: number[]) {}
}

export class UpdateScheduleListCalendarFilterServices {
  static readonly type = '[Schedule List Calendar] Update Selected Services';

  constructor(public data: number[]) {}
}

export class UpdateScheduleListCalendarFilterSites {
  static readonly type = '[Schedule List Calendar]  Update Selected Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateScheduleListCalendarFilterStatuses {
  static readonly type = '[Schedule List Calendar] Update Selected Statuses';

  constructor(public data: number[]) {}
}

export class UpdateScheduleListCalendarFilterByKey {
  static readonly type = '[Schedule List Calendar] Update Filter';

  constructor(
    public data: unknown,
    public key: ScheduleCalendarFilterKey,
  ) {}
}

export class UpdateScheduleStatusToConfirmed {
  static readonly type =
    '[Schedule List Calendar] Update Schedule Status To Confirmed';

  constructor(public siteAuditId: number) {}
}

export class UpdateScheduleStatusForReschedule {
  static readonly type =
    '[Schedule List Calendar] Update Schedule Status For Reschedule';

  constructor(public siteAuditId: number) {}
}

export class ResetScheduleListFilters {
  static readonly type =
    '[Schedule List Calendar] Reset All Filters Except Date To Current Year';
}

export class ResetScheduleListCalendarState {
  static readonly type =
    '[Schedule List Calendar] Reset Schedules List Calendar State';
}

export class LoadScheduleListAndCalendarFiltersSuccess {
  static readonly type =
    '[Schedule List Calendar] Load List And Calendar Filters Success';

  constructor(
    public schedules: ScheduleListItemEnrichedDto[],
    public allSchedules: ScheduleListItemEnrichedDto[],
    public dataCompanies: SharedSelectMultipleDatum<number>[],
    public dataServices: SharedSelectMultipleDatum<number>[],
    public dataSites: CustomTreeNode[],
    public dataStatuses: SharedSelectMultipleDatum<number>[],
  ) {}
}
export class LoadScheduleListAndCalendarFiltersError {
  static readonly type =
    '[Schedule List Calendar] Load List And Calendar Filters Error';

  constructor(public error: Error) {}
}
