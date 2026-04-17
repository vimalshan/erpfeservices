import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import { ContractsListItemModel } from '../../models';
import {
  ExportContractsExcel,
  LoadContractsList,
  ResetContractsListState,
  UpdateGridConfig,
} from '../actions';
import { ContractsListSelectors } from '../selectors';

@Injectable()
export class ContractsListStoreService {
  get contracts(): Signal<ContractsListItemModel[]> {
    return this.store.selectSignal(ContractsListSelectors.contracts);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(ContractsListSelectors.totalFilteredRecords);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(ContractsListSelectors.hasActiveFilters);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(ContractsListSelectors.filterOptions);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(ContractsListSelectors.filteringConfig);
  }

  get filteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(ContractsListSelectors.filteringConfig);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(ContractsListSelectors.isLoading);
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadContractsList = () => new LoadContractsList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  exportContractsExcel = () => new ExportContractsExcel();

  @Dispatch()
  resetContractListState = () => new ResetContractsListState();
}
