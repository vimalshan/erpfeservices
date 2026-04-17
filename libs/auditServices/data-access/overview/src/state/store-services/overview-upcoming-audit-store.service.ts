import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { OverviewUpcomingAuditEvent } from '../../models';
import { LoadOverviewUpcomingAuditEvents } from '../actions';
import { OverviewUpcomingAuditsSelectors } from '../selectors';

@Injectable()
export class OverviewUpcomingAuditStoreService {
  constructor(private store: Store) {}

  get overviewUpcomingAuditEvent(): Signal<OverviewUpcomingAuditEvent[]> {
    return this.store.selectSignal(
      OverviewUpcomingAuditsSelectors.getUpcomingAuditEvent,
    );
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(OverviewUpcomingAuditsSelectors.isLoading);
  }

  @Dispatch()
  loadOverviewUpcomingAuditEvents = (
    selectedMonth: number,
    selectedYear: number,
  ) => new LoadOverviewUpcomingAuditEvents(selectedMonth, selectedYear);
}
