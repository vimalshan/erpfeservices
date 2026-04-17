import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import { FindingListItemModel } from '../../models';
import {
  ApplyNavigationFiltersFromOverview,
  ExportFindingsExcel,
  LoadFindingsList,
  ResetFindingsListState,
  UpdateGridConfig,
} from '../actions';
import { FindingsListSelectors } from '../selectors';

@Injectable()
export class FindingsListStoreService {
  get totalRecords(): Signal<number> {
    return this.store.selectSignal(FindingsListSelectors.totalFilteredRecords);
  }

  get findingsItems(): Signal<FindingListItemModel[]> {
    return this.store.selectSignal(FindingsListSelectors.findingsItems);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(FindingsListSelectors.filterOptions);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(FindingsListSelectors.hasActiveFilters);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(FindingsListSelectors.filteringConfig);
  }

  get filteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(FindingsListSelectors.filteringConfig);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(FindingsListSelectors.isLoading);
  }

  get loaded$(): Observable<boolean> {
    return this.store.select(FindingsListSelectors.loaded);
  }

  get loaded(): Signal<boolean> {
    return this.store.selectSignal(FindingsListSelectors.loaded);
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadFindingsList = () => new LoadFindingsList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  exportFindingsExcel = () => new ExportFindingsExcel();

  @Dispatch()
  resetFindingsListState = () => new ResetFindingsListState();

  @Dispatch()
  applyNavigationFiltersFromOverview = () =>
    new ApplyNavigationFiltersFromOverview();
}
