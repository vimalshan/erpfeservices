import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { CalendarViewType } from '@customer-portal/shared/models';
import { FilterValue } from '@customer-portal/shared/models/grid';

import {
  OverviewFinancialNavigateToListView,
  OverviewUpcomingSetSelectedDate,
  ResetOverviewSharedState,
  SetFinancialStatusChartNavigationPayload,
} from '../actions';
import { OverviewSharedState } from '../overview-shared.state';
import { OverviewSharedSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class OverviewSharedStoreService {
  constructor(private store: Store) {}

  get overviewUpcomingAuditSelectedDate(): Signal<Date | undefined> {
    return this.store.selectSignal(OverviewSharedSelectors.getSelectedDate);
  }

  get overviewUpcomingAuditSelectDateViewType(): Signal<string> {
    return this.store.selectSignal(
      OverviewSharedSelectors.getSelectedCalendarViewType,
    );
  }

  get overviewFinancialStatus(): Signal<FilterValue[]> {
    return this.store.selectSignal(
      OverviewSharedState.getSelectedFinancialStatus,
    );
  }

  get overviewNavigationFilters$(): Observable<FilterValue[] | undefined> {
    return this.store.select(OverviewSharedSelectors.getNavigationFilters);
  }

  @Dispatch()
  setSelectedDate = (
    date: Date | undefined,
    calendarViewType: CalendarViewType,
  ) => new OverviewUpcomingSetSelectedDate(date, calendarViewType);

  @Dispatch()
  navigateFromChartToListView = (filters: FilterValue[]) =>
    new OverviewFinancialNavigateToListView(filters);

  @Dispatch()
  setFinancialStatusChartNavigationPayload = (state: FilterValue[]) =>
    new SetFinancialStatusChartNavigationPayload(state);

  @Dispatch()
  resetOverviewSharedState = () => new ResetOverviewSharedState();
}
