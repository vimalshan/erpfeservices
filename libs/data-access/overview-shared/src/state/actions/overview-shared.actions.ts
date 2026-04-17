import { CalendarViewType } from '@customer-portal/shared/models';
import { FilterValue } from '@customer-portal/shared/models/grid';

export class OverviewUpcomingSetSelectedDate {
  static readonly type = '[Overview Shared] Set Selected Date';

  constructor(
    public date: Date | undefined,
    public calendarViewType: CalendarViewType,
  ) {}
}

export class OverviewFinancialNavigateToListView {
  static readonly type = '[Overview Shared] Navigate From Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}

export class SetFinancialStatusChartNavigationPayload {
  static readonly type =
    '[Overview Shared] Set Financial Status Chart Navigation Payload';

  constructor(public chartNavigationPayload: FilterValue[]) {}
}

export class ResetOverviewSharedState {
  static readonly type = '[Overview Shared] Reset State';
}

export abstract class NavigateFromOverviewCardAction {
  constructor(public overviewCardFilters: FilterValue[]) {}
}

export class SetNavigationFilters {
  static readonly type = '[OverviewShared] Set Navigation Filters';

  constructor(public filters: FilterValue[]) {}
}

export class ClearNavigationFilters {
  static readonly type = '[OverviewShared] Clear Navigation Filters';
}
