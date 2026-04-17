import { Selector } from '@ngxs/store';

import { CalendarViewType, FilterValue } from '@customer-portal/shared/models';

import {
  OverviewSharedState,
  OverviewSharedStateModel,
} from '../overview-shared.state';

export class OverviewSharedSelectors {
  @Selector([OverviewSharedState])
  static getSelectedDate(state: OverviewSharedStateModel): Date | undefined {
    return state.auditCalendarSelectedDate;
  }

  @Selector([OverviewSharedState])
  static getSelectedCalendarViewType(state: OverviewSharedStateModel): string {
    return state.auditCalendarViewType;
  }

  @Selector([OverviewSharedState])
  static getNavigationFilters(
    state: OverviewSharedStateModel,
  ): FilterValue[] | undefined {
    return state.navigationFilters;
  }
}
