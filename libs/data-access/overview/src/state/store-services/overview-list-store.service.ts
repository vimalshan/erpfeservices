import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  CardDataModel,
  CardNavigationPayload,
  CustomTreeNode,
} from '@customer-portal/shared/models';

import { OverviewFilterTypes } from '../../constants';
import {
  LoadMoreOverviewListCardData,
  LoadOverviewListCardData,
  LoadOverviewListFilters,
  NavigateFromOverviewListCardToListView,
  ResetOverviewListFilterState,
  ResetOverviewListState,
  UpdateOverviewListFilterByKey,
} from '../actions';
import { OverviewListSelectors } from '../selectors';

@Injectable()
export class OverviewListStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(OverviewListSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(OverviewListSelectors.dataServices);
  }

  get dataSites(): Signal<CustomTreeNode[]> {
    return this.store.selectSignal(OverviewListSelectors.dataSites);
  }

  get dataSites$(): Observable<CustomTreeNode[]> {
    return this.store.select(OverviewListSelectors.dataSites);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(OverviewListSelectors.filterCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(OverviewListSelectors.filterServices);
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(OverviewListSelectors.filterSites);
  }

  get filterSites$(): Observable<number[]> {
    return this.store.select(OverviewListSelectors.filterSites);
  }

  get filtersLoaded(): Signal<boolean> {
    return this.store.selectSignal(OverviewListSelectors.filtersLoaded);
  }

  get filtersIsLoading(): Signal<boolean> {
    return this.store.selectSignal(OverviewListSelectors.filtersIsLoading);
  }

  get filtersError(): Signal<string | null> {
    return this.store.selectSignal(OverviewListSelectors.filtersError);
  }

  get overviewCardError(): Signal<string | null> {
    return this.store.selectSignal(OverviewListSelectors.error);
  }

  get overviewCardData(): Signal<CardDataModel[]> {
    return this.store.selectSignal(OverviewListSelectors.overviewCardData);
  }

  get hasMorePages(): Signal<boolean> {
    return this.store.selectSignal(OverviewListSelectors.hasMorePages);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(OverviewListSelectors.isLoading);
  }

  @Dispatch()
  loadOverviewListFilters = () => new LoadOverviewListFilters();

  @Dispatch()
  updateOverviewListFilterByKey = (data: unknown, key: OverviewFilterTypes) =>
    new UpdateOverviewListFilterByKey(data, key);

  @Dispatch()
  resetOverviewListFilterState = () => new ResetOverviewListFilterState();

  @Dispatch()
  loadOverviewListCardData = () => new LoadOverviewListCardData();

  @Dispatch()
  loadMoreOverviewListCardData = () => new LoadMoreOverviewListCardData();

  @Dispatch()
  navigateFromOverviewListCardToListView = (payload: CardNavigationPayload) =>
    new NavigateFromOverviewListCardToListView(payload);

  @Dispatch()
  resetOverviewListState = () => new ResetOverviewListState();
}
