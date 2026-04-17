import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { DoughnutChartModel } from '@customer-portal/shared';

import { LoadOverviewFinancialStatusData } from '../actions';
import { OverviewFinancialStatusSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class OverviewFinancialStatusStoreService {
  constructor(private store: Store) {}

  get overviewFinancialStatusGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      OverviewFinancialStatusSelectors.overviewFinancialStatusGraphData,
    );
  }

  get overviewFinancialStatusError(): Signal<boolean> {
    return this.store.selectSignal(
      OverviewFinancialStatusSelectors.overviewFinancialStatusError,
    );
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(OverviewFinancialStatusSelectors.isLoading);
  }

  @Dispatch()
  loadOverviewFinancialStatusData = () => new LoadOverviewFinancialStatusData();
}
