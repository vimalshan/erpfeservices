import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { CardDataModel, CardNavigationPayload } from '@customer-portal/shared';

import {
  LoadMoreOverviewCardData,
  LoadOverviewCardData,
  NavigateFromOverviewCardToListView,
  ResetOverviewState,
} from '../actions';
import { OverviewSelectors } from '../selectors';

@Injectable()
export class OverviewStoreService {
  get overviewCardData(): Signal<CardDataModel[]> {
    return this.store.selectSignal(OverviewSelectors.overviewCardData);
  }

  get hasMorePages(): Signal<boolean> {
    return this.store.selectSignal(OverviewSelectors.hasMorePages);
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadOverviewCardData = () => new LoadOverviewCardData();

  @Dispatch()
  loadMoreOverviewCardData = () => new LoadMoreOverviewCardData();

  @Dispatch()
  resetOverviewCardData = () => new ResetOverviewState();

  @Dispatch()
  navigateFromOverviewCardToListView = (payload: CardNavigationPayload) =>
    new NavigateFromOverviewCardToListView(payload);
}
