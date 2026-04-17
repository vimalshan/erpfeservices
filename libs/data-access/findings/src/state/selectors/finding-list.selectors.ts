import { Selector } from '@ngxs/store';

import {
  applyGridConfig,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  FilterOptions,
} from '@customer-portal/shared/models/grid';

import { FindingListItemModel } from '../../models';
import {
  FindingsListState,
  FindingsListStateModel,
} from '../findings-list.state';

export class FindingsListSelectors {
  @Selector([FindingsListSelectors._findingsItems])
  static findingsItems(
    findingsItems: FindingListItemModel[],
  ): FindingListItemModel[] {
    return findingsItems;
  }

  @Selector([FindingsListSelectors._totalFilteredRecords])
  static totalFilteredRecords(totalFilteredRecords: number): number {
    return totalFilteredRecords;
  }

  @Selector([FindingsListSelectors._filterOptions])
  static filterOptions(filterOptions: FilterOptions): FilterOptions {
    return filterOptions;
  }

  @Selector([FindingsListSelectors._filteringConfig])
  static filteringConfig(filteringConfig: FilteringConfig): FilteringConfig {
    return filteringConfig;
  }

  @Selector([FindingsListSelectors._hasActiveFilters])
  static hasActiveFilters(hasActiveFilters: boolean): boolean {
    return hasActiveFilters;
  }

  @Selector([FindingsListSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([FindingsListSelectors._loaded])
  static loaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingsListState])
  private static _loaded(state: FindingsListStateModel): boolean {
    return state.loaded;
  }

  @Selector([FindingsListState])
  private static _findingsItems(
    state: FindingsListStateModel,
  ): FindingListItemModel[] {
    const { findingsItems, gridConfig } = state;

    return applyGridConfig(findingsItems, gridConfig);
  }

  @Selector([FindingsListState])
  private static _totalFilteredRecords(state: FindingsListStateModel): number {
    const { findingsItems, gridConfig } = state;

    return getNumberOfFilteredRecords(findingsItems, gridConfig);
  }

  @Selector([FindingsListState])
  private static _filterOptions(state: FindingsListStateModel): FilterOptions {
    return state.filterOptions;
  }

  @Selector([FindingsListState])
  private static _filteringConfig(
    state: FindingsListStateModel,
  ): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([FindingsListState])
  private static _hasActiveFilters(state: FindingsListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([FindingsListState])
  private static _isLoading(state: FindingsListStateModel): boolean {
    return state.isLoading;
  }
}
