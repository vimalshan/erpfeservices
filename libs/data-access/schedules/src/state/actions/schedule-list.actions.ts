import { GridConfig } from '@customer-portal/shared';

import { ScheduleListItemModel } from '../../models';

export class LoadScheduleList {
  static readonly type = '[Schedule List] Load Schedule List';
}

export class LoadScheduleListSuccess {
  static readonly type = '[Schedule List] Load Schedule List Succes';

  constructor(public schedules: ScheduleListItemModel[]) {}
}
export class LoadScheduleListFail {
  static readonly type = '[Schedule List] Load Schedule List Fail';
}
export class UpdateGridConfig {
  static readonly type = '[Schedule List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Schedule List] Update Filter Options';
}

export class ExportSchedulesExcel {
  static readonly type = '[Schedule List] Export Schedules Excel';
}

export class ExportSchedulesExcelSuccess {
  static readonly type = '[Schedule List] Export Schedules Excel Success';

  constructor(public input: number[]) {}
}

export class ExportSchedulesExcelFail {
  static readonly type = '[Schedule List] Export Schedules Excel Fail';
}

export class ResetScheduleListState {
  static readonly type = '[Schedule List] Reset Schedules List State';
}

export class UpdateScheduleListStatusToConfirmed {
  static readonly type =
    '[Schedule List] Update Schedule List Status To Confirmed';

  constructor(public siteAuditId: number) {}
}

export class UpdateScheduleListForReschedule {
  static readonly type = '[Schedule List] Update Schedule List For Reschedule';

  constructor(public siteAuditId: number) {}
}

export class ApplyNavigationFiltersFromOverview {
  static readonly type =
    '[ScheduleList] Apply Navigation Filters From Overview';
}
