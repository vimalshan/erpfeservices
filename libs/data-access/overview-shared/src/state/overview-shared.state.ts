import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';

import { AppPagesEnum } from '@customer-portal/shared/constants';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import {
  CalendarViewType,
  ToastSeverity,
} from '@customer-portal/shared/models';
import { FilterValue } from '@customer-portal/shared/models/grid';

import {
  ClearNavigationFilters,
  OverviewFinancialNavigateToListView,
  OverviewUpcomingSetSelectedDate,
  ResetOverviewSharedState,
  SetFinancialStatusChartNavigationPayload,
  SetNavigationFilters,
} from './actions';

export interface OverviewSharedStateModel {
  auditCalendarSelectedDate: Date | undefined;
  auditCalendarViewType: CalendarViewType | string;
  financialStatusSelectedState: FilterValue[];
  chartNavigationPayload: FilterValue[];
  navigationFilters?: FilterValue[];
}

const defaultState: OverviewSharedStateModel = {
  auditCalendarSelectedDate: undefined,
  auditCalendarViewType: '',
  financialStatusSelectedState: [
    {
      label: '',
      value: [],
    },
  ],
  chartNavigationPayload: [],
};

@State<OverviewSharedStateModel>({
  name: 'overviewShared',
  defaults: defaultState,
})
@Injectable()
export class OverviewSharedState {
  constructor(private messageService: MessageService) {}

  @Selector()
  static getSelectedFinancialStatus(
    state: OverviewSharedStateModel,
  ): FilterValue[] {
    return state.financialStatusSelectedState;
  }

  @Action(OverviewUpcomingSetSelectedDate)
  setSelectedDate(
    ctx: StateContext<OverviewSharedStateModel>,
    action: OverviewUpcomingSetSelectedDate,
  ) {
    ctx.patchState({
      auditCalendarSelectedDate: action.date,
      auditCalendarViewType: action.calendarViewType,
    });

    if (action.date) {
      ctx.dispatch(new Navigate([AppPagesEnum.Schedule]));
    }
  }

  @Action(OverviewFinancialNavigateToListView)
  navigateFromChartToListView(
    ctx: StateContext<OverviewSharedStateModel>,
    action: OverviewFinancialNavigateToListView,
  ) {
    try {
      ctx.patchState({
        financialStatusSelectedState: action.tooltipFilters,
      });
      ctx.dispatch(new Navigate([AppPagesEnum.Financials]));
    } catch (error) {
      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
      );
    }
  }

  @Action(SetFinancialStatusChartNavigationPayload)
  setFinancialStatusChartNavigationPayload(
    ctx: StateContext<OverviewSharedStateModel>,
    { chartNavigationPayload }: SetFinancialStatusChartNavigationPayload,
  ) {
    ctx.patchState({
      chartNavigationPayload,
    });
  }

  @Action(ResetOverviewSharedState)
  resetOverviewSharedState(ctx: StateContext<OverviewSharedStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(SetNavigationFilters)
  setNavigationFilters(
    ctx: StateContext<OverviewSharedStateModel>,
    action: SetNavigationFilters,
  ) {
    ctx.patchState({ navigationFilters: action.filters });
  }

  @Action(ClearNavigationFilters)
  clearNavigationFilters(ctx: StateContext<OverviewSharedStateModel>) {
    ctx.patchState({ navigationFilters: [] });
  }
}
