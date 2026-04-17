import { Selector } from '@ngxs/store';

import { DoughnutChartModel } from '@customer-portal/shared';

import {
  OverviewFinancialStatusState,
  OverviewFinancialStatusStateModel,
} from '../overview-financial-status.state';

export class OverviewFinancialStatusSelectors {
  @Selector([OverviewFinancialStatusState])
  static overviewFinancialStatusGraphData(
    state: OverviewFinancialStatusStateModel,
  ): DoughnutChartModel {
    return state.overviewFinancialStatusGraphData;
  }

  @Selector([OverviewFinancialStatusSelectors._isLoading])
  static isLoading(_isLoading: boolean): boolean {
    return _isLoading;
  }

  @Selector([OverviewFinancialStatusState])
  static overviewFinancialStatusError(
    state: OverviewFinancialStatusStateModel,
  ): boolean {
    return state.overviewFinancialStatusError;
  }

  @Selector([OverviewFinancialStatusState])
  private static _isLoading(state: OverviewFinancialStatusStateModel): boolean {
    return state.isLoading;
  }
}
