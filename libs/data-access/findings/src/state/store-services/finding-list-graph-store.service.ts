import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
  FilterValue,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';

import { FindingChartFilterKey } from '../../constants';
import { FindingListItemEnrichedDto } from '../../dtos';
import { FindingTabs, FindingTrendsGraphModel } from '../../models';
import {
  LoadFindingListAndGraphFilters,
  LoadFindingListByClauseList,
  LoadFindingListBySiteList,
  LoadFindingListByStatusGraphData,
  LoadFindingListDataTrends,
  LoadFindingListGraphData,
  LoadFindingListStatusByCategoryGraphData,
  LoadFindingListTrendsGraphData,
  LoadOpenFindingListGraphData,
  NavigateFromFindingListChartToListView,
  NavigateFromFindingListTreeTableToListView,
  ResetFindingListGraphFiltersExceptDateToCurrentYear,
  ResetFindingsListGraphState,
  SetActiveFindingListGraphTab,
  UpdateFindingListGraphFilterByKey,
} from '../actions';
import { FindingListGraphSelectors } from '../selectors';

@Injectable()
export class FindingListGraphStoreService {
  constructor(private store: Store) {}

  get allFindingItems(): Signal<FindingListItemEnrichedDto[]> {
    return this.store.selectSignal(FindingListGraphSelectors.allFindingItems);
  }

  get loading(): Signal<boolean> {
    return this.store.selectSignal(FindingListGraphSelectors.loading);
  }

  get loaded(): Signal<boolean> {
    return this.store.selectSignal(FindingListGraphSelectors.loaded);
  }

  get error(): Signal<string | null> {
    return this.store.selectSignal(FindingListGraphSelectors.error);
  }

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(FindingListGraphSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(FindingListGraphSelectors.dataServices);
  }

  get dataSites(): Signal<CustomTreeNode[]> {
    return this.store.selectSignal(FindingListGraphSelectors.dataSites);
  }

  get dataSites$(): Observable<CustomTreeNode[]> {
    return this.store.select(FindingListGraphSelectors.dataSites);
  }

  get findingItems(): Signal<any[]> {
    return this.store.selectSignal(FindingListGraphSelectors.findingItems);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(FindingListGraphSelectors.filterCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(FindingListGraphSelectors.filterServices);
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(FindingListGraphSelectors.filterSites);
  }

  get filterSites$(): Observable<number[]> {
    return this.store.select(FindingListGraphSelectors.filterSites);
  }

  get findingsByStatusGraphData$(): Observable<DoughnutChartModel> {
    return this.store.select(
      FindingListGraphSelectors.findingsByStatusGraphData,
    );
  }

  get filterDateRange(): Signal<Date[]> {
    return this.store.selectSignal(FindingListGraphSelectors.filterDateRange);
  }

  get filterStartDate(): Signal<Date | null> {
    return this.store.selectSignal(FindingListGraphSelectors.filterStartDate);
  }

  get filterEndDate(): Signal<Date | null> {
    return this.store.selectSignal(FindingListGraphSelectors.filterEndDate);
  }

  get findingsByStatusGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsByStatusGraphData,
    );
  }

  get findingStatusByCategoryGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingStatusByCategoryGraphData,
    );
  }

  get overdueFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.overdueFindingsGraphData,
    );
  }

  get becomingOverdueFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.becomingOverdueFindingsGraphData,
    );
  }

  get inProgressFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.inProgressFindingsGraphData,
    );
  }

  get earlyStageFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.earlyStageFindingsGraphData,
    );
  }

  get overdueFindingsLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.overdueFindingsLoaded,
    );
  }

  get becomingOverdueFindingsLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.becomingOverdueFindingsLoaded,
    );
  }

  get inProgressFindingsLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.inProgressFindingsLoaded,
    );
  }

  get earlyStageFindingsLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.earlyStageFindingsLoaded,
    );
  }

  get findingsByStatusLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsByStatusLoaded,
    );
  }

  get findingStatusByCategoryLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingStatusByCategoryLoaded,
    );
  }

  get findingByClauseListLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseListLoaded,
    );
  }

  get findingByClauseListLoading(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseListLoading,
    );
  }

  get findingByClauseListError(): Signal<string | null> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseListError,
    );
  }

  get findingsByClauseList(): Signal<TreeNode[]> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseList,
    );
  }

  get findingsByClauseListColumns(): Signal<TreeColumnDefinition[]> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseColumns,
    );
  }

  get findingsByClauseListGradient(): Signal<{
    [key: string]: Map<number, string>;
  }> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseListGradient,
    );
  }

  get findingTrendsGraphDataLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingTrendsGraphDataLoaded,
    );
  }

  get findingTrendsDataLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingTrendsDataLoaded,
    );
  }

  get findingsBySiteListLoaded(): Signal<boolean> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsBySiteListLoaded,
    );
  }

  get findingsBySiteListError(): Signal<string | null> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsBySiteListError,
    );
  }

  get findingsBySiteList(): Signal<TreeNode[]> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsBySiteList,
    );
  }

  get findingsBySiteListGradient(): Signal<{
    [key: string]: Map<number, string>;
  }> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsBySiteListGradient,
    );
  }

  get findingsBySiteListColumns(): Signal<TreeColumnDefinition[]> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsBySiteListColumns,
    );
  }

  get findingsTrendsGraphData(): Signal<FindingTrendsGraphModel> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingTrendsGraphData,
    );
  }

  get findingsTrendsColumns(): Signal<TreeColumnDefinition[]> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingTrendsColumns,
    );
  }

  get findingsTrendsData(): Signal<TreeNode[]> {
    return this.store.selectSignal(FindingListGraphSelectors.findingTrendsData);
  }

  get findingsTrendsGradient(): Signal<Map<number, string>> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingTrendsGradient,
    );
  }

  get findingsClauseByClauseColumns(): Signal<TreeColumnDefinition[]> {
    return this.store.selectSignal(
      FindingListGraphSelectors.findingsClauseByClauseColumns,
    );
  }

  @Dispatch()
  setActiveFindingListGraphTab = (activeTab: FindingTabs) =>
    new SetActiveFindingListGraphTab(activeTab);

  @Dispatch()
  loadFindingListAndGraphFilters = () => new LoadFindingListAndGraphFilters();

  @Dispatch()
  updateFindingListGraphFilterByKey = (
    data: unknown,
    key: FindingChartFilterKey,
  ) => new UpdateFindingListGraphFilterByKey(data, key);

  @Dispatch()
  resetFindingListGraphFiltersExceptDateToCurrentYear = () =>
    new ResetFindingListGraphFiltersExceptDateToCurrentYear();

  @Dispatch()
  resetFindingsListGraphState = () => new ResetFindingsListGraphState();

  @Dispatch()
  loadFindingListGraphData = () => new LoadFindingListGraphData();

  @Dispatch()
  loadFindingListByStatusGraphData = () =>
    new LoadFindingListByStatusGraphData();

  @Dispatch()
  loadFindingListStatusByCategoryGraphData = () =>
    new LoadFindingListStatusByCategoryGraphData();

  @Dispatch()
  loadOpenFindingListGraphData = () => new LoadOpenFindingListGraphData();

  @Dispatch()
  loadFindingListTrendsGraphData = () => new LoadFindingListTrendsGraphData();

  @Dispatch()
  loadFindingListDataTrends = () => new LoadFindingListDataTrends();

  @Dispatch()
  navigateFromFindingListChartToListView = (filters: FilterValue[]) =>
    new NavigateFromFindingListChartToListView(filters);

  @Dispatch()
  navigateFromFindingListTreeTableToListView = (filters: FilterValue[]) =>
    new NavigateFromFindingListTreeTableToListView(filters);

  @Dispatch()
  loadFindingListByClauseList = () => new LoadFindingListByClauseList();

  @Dispatch()
  loadFindingListBySiteList = () => new LoadFindingListBySiteList();
}
