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
  IndividualFilter,
} from '@customer-portal/shared/models';

import { AuditChartFilterKey, AuditChartsTabs } from '../../constants';
import {
  LoadAuditListAndGraphFilters,
  LoadAuditListDaysBarGraphData,
  LoadAuditListDaysDoughnutGraphData,
  LoadAuditListDaysGridData,
  LoadAuditListGraphsData,
  NavigateFromAuditListChartToListView,
  NavigateFromAuditListChartTreeToListView,
  ResetAuditListGraphFiltersExceptDateToCurrentYear,
  ResetAuditsListGraphState,
  SetActiveAuditsListGraphTab,
  UpdateAuditListGraphFilterByKey,
} from '../actions';
import { AuditListGraphSelectors } from '../selectors';

@Injectable()
export class AuditListGraphStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(AuditListGraphSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(AuditListGraphSelectors.dataServices);
  }

  get dataSites(): Signal<CustomTreeNode[]> {
    return this.store.selectSignal(AuditListGraphSelectors.dataSites);
  }

  get dataSites$(): Observable<CustomTreeNode[]> {
    return this.store.select(AuditListGraphSelectors.dataSites);
  }

  get auditItems(): Signal<any[]> {
    return this.store.selectSignal(AuditListGraphSelectors.auditItems);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(AuditListGraphSelectors.filterCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(AuditListGraphSelectors.filterServices);
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(AuditListGraphSelectors.filterSites);
  }

  get filterSites$(): Observable<number[]> {
    return this.store.select(AuditListGraphSelectors.filterSites);
  }

  get filterDateRange(): Signal<Date[]> {
    return this.store.selectSignal(AuditListGraphSelectors.filterDateRange);
  }

  get auditStatusDoughnutGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      AuditListGraphSelectors.auditStatusDoughnutGraphData,
    );
  }

  get auditStatusBarGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      AuditListGraphSelectors.auditStatusBarGraphData,
    );
  }

  get auditsDaysDoughnutGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      AuditListGraphSelectors.auditDaysDoughnutGraphData,
    );
  }

  get auditDaysBarGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      AuditListGraphSelectors.auditDaysBarGraphData,
    );
  }

  get auditDaysGridData(): Signal<TreeNode[]> {
    return this.store.selectSignal(AuditListGraphSelectors.auditDaysGridData);
  }

  @Dispatch()
  loadAuditListAndGraphFilters = () => new LoadAuditListAndGraphFilters();

  @Dispatch()
  updateAuditListGraphFilterByKey = (data: unknown, key: AuditChartFilterKey) =>
    new UpdateAuditListGraphFilterByKey(data, key);

  @Dispatch()
  resetAuditListGraphFiltersExceptDateToCurrentYear = () =>
    new ResetAuditListGraphFiltersExceptDateToCurrentYear();

  @Dispatch()
  navigateFromAuditListChartToListView = (filters: FilterValue[]) =>
    new NavigateFromAuditListChartToListView(filters);

  @Dispatch()
  resetAuditsListGraphState = () => new ResetAuditsListGraphState();

  @Dispatch()
  loadAuditListGraphsData = () => new LoadAuditListGraphsData();

  @Dispatch()
  loadAuditListDaysDoughnutGraphData = () =>
    new LoadAuditListDaysDoughnutGraphData();

  @Dispatch()
  loadAuditListDaysBarGraphData = () => new LoadAuditListDaysBarGraphData();

  @Dispatch()
  loadAuditListDaysGridData = () => new LoadAuditListDaysGridData();

  @Dispatch()
  setActiveAuditsListGraphTab = (activeTab: AuditChartsTabs) =>
    new SetActiveAuditsListGraphTab(activeTab);

  @Dispatch()
  navigateFromAuditListChartTreeToListView = (filterValue: IndividualFilter) =>
    new NavigateFromAuditListChartTreeToListView(filterValue);
}
