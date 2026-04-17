import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import { AuditListItemModel } from '../../models';
import {
  ApplyNavigationFiltersFromOverview,
  ExportAuditsExcel,
  LoadAuditList,
  ResetAuditListState,
  UpdateGridConfig,
} from '../actions';
import { AuditListSelectors } from '../selectors';

@Injectable()
export class AuditListStoreService {
  constructor(private store: Store) {}

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(AuditListSelectors.totalFilteredRecords);
  }

  get auditItems(): Signal<AuditListItemModel[]> {
    return this.store.selectSignal(AuditListSelectors.auditItems);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(AuditListSelectors.filterOptions);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(AuditListSelectors.hasActiveFilters);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(AuditListSelectors.filteringConfig);
  }

  get filteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(AuditListSelectors.filteringConfig);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(AuditListSelectors.isLoading);
  }

  @Dispatch()
  loadAuditList = () => new LoadAuditList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  exportAuditsExcel = () => new ExportAuditsExcel();

  @Dispatch()
  resetAuditListState = () => new ResetAuditListState();

  @Dispatch()
  applyNavigationFiltersFromOverview = () =>
    new ApplyNavigationFiltersFromOverview();
}
