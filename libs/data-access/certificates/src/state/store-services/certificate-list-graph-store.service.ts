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

import { CertificateChartFilterKey } from '../../constants';
import { CertificatesTabs } from '../../models';
import {
  LoadCertificateListAndGraphFilters,
  LoadCertificateListGraphData,
  LoadCertificatesBySiteListData,
  LoadCertificatesByStatusListGraphData,
  LoadCertificatesByTypeListGraphData,
  NavigateFromListChartToListView,
  ResetCertificateListGraphData,
  ResetCertificateListGraphFiltersExceptDateToCurrentYear,
  ResetCertificateListGraphState,
  SetActiveCertificatesListGraphTab,
  UpdateCertificateListGraphFilterByKey,
} from '../actions';
import { CertificateListGraphSelectors } from '../selectors';

@Injectable()
export class CertificateListGraphStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(CertificateListGraphSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(CertificateListGraphSelectors.dataServices);
  }

  get dataSites(): Signal<CustomTreeNode[]> {
    return this.store.selectSignal(CertificateListGraphSelectors.dataSites);
  }

  get dataSites$(): Observable<CustomTreeNode[]> {
    return this.store.select(CertificateListGraphSelectors.dataSites);
  }

  get certificateItems(): Signal<any[]> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.certificateItems,
    );
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.filterCompanies,
    );
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.filterServices,
    );
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(CertificateListGraphSelectors.filterSites);
  }

  get filterSites$(): Observable<number[]> {
    return this.store.select(CertificateListGraphSelectors.filterSites);
  }

  get filterDateRange(): Signal<Date[]> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.filterDateRange,
    );
  }

  get certificatesByStatusGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.certificatesByStatusGraphData,
    );
  }

  get certificatesByTypeGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.certificatesByTypeGraphData,
    );
  }

  get certificatesBySiteData(): Signal<TreeNode[]> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.certificatesBySiteData,
    );
  }

  get isLoadingCertificateBySite(): Signal<boolean> {
    return this.store.selectSignal(
      CertificateListGraphSelectors.isLoadingCertificateBySite,
    );
  }

  get certificateBySiteColumns(): Signal<
    Record<string, TreeColumnDefinition[]>
  > {
    return this.store.selectSignal(
      CertificateListGraphSelectors.certificatesBySiteColumns,
    );
  }

  @Dispatch()
  setActiveCertificatesListGraphTab = (activeTab: CertificatesTabs) =>
    new SetActiveCertificatesListGraphTab(activeTab);

  @Dispatch()
  loadCertificateListAndGraphFilters = () =>
    new LoadCertificateListAndGraphFilters();

  @Dispatch()
  updateCertificateListGraphFilterByKey = (
    data: unknown,
    key: CertificateChartFilterKey,
  ) => new UpdateCertificateListGraphFilterByKey(data, key);

  @Dispatch()
  resetCertificateListGraphFiltersExceptDateToCurrentYear = () =>
    new ResetCertificateListGraphFiltersExceptDateToCurrentYear();

  @Dispatch()
  resetCertificateListGraphState = () => new ResetCertificateListGraphState();

  @Dispatch()
  loadCertificatesListGraphsData = () => new LoadCertificateListGraphData();

  @Dispatch()
  resetCertificateListGraphData = () => new ResetCertificateListGraphData();

  @Dispatch()
  loadCertificatesByStatusListGraphData = () =>
    new LoadCertificatesByStatusListGraphData();

  @Dispatch()
  loadCertificatesByTypeListGraphData = () =>
    new LoadCertificatesByTypeListGraphData();

  @Dispatch()
  loadCertificatesBySiteListData = () => new LoadCertificatesBySiteListData();

  @Dispatch()
  navigateFromListChartToListView = (filters: FilterValue[]) =>
    new NavigateFromListChartToListView(filters);
}
