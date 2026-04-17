import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import { CertificateListItemModel } from '../../models';
import {
  ApplyNavigationFiltersFromOverview,
  ExportCertificatesExcel,
  LoadCertificateList,
  ResetCertificateListState,
  UpdateGridConfig,
} from '../actions';
import { CertificateListSelectors } from '../selectors';

@Injectable()
export class CertificateListStoreService {
  get certificates(): Signal<CertificateListItemModel[]> {
    return this.store.selectSignal(CertificateListSelectors.certificates);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(
      CertificateListSelectors.totalFilteredRecords,
    );
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(CertificateListSelectors.filterOptions);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(CertificateListSelectors.hasActiveFilters);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(CertificateListSelectors.filteringConfig);
  }

  get filteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(CertificateListSelectors.filteringConfig);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(CertificateListSelectors.isLoading);
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadCertificateList = () => new LoadCertificateList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  exportCertificatesExcel = () => new ExportCertificatesExcel();

  @Dispatch()
  resetCertificateListState = () => new ResetCertificateListState();

  @Dispatch()
  applyNavigationFiltersFromOverview = () =>
    new ApplyNavigationFiltersFromOverview();
}
