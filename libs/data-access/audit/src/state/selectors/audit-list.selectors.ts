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

import { AuditListItemModel } from '../../models';
import { AuditListState, AuditListStateModel } from '../audit-list.state';

export class AuditListSelectors {
  @Selector([AuditListSelectors._auditItems])
  static auditItems(auditItems: AuditListItemModel[]): AuditListItemModel[] {
    return auditItems;
  }

  @Selector([AuditListSelectors._totalFilteredRecords])
  static totalFilteredRecords(totalFilteredRecords: number): number {
    return totalFilteredRecords;
  }

  @Selector([AuditListSelectors._filterOptions])
  static filterOptions(filterOptions: FilterOptions): FilterOptions {
    return filterOptions;
  }

  @Selector([AuditListSelectors._filteringConfig])
  static filteringConfig(filteringConfig: FilteringConfig): FilteringConfig {
    return filteringConfig;
  }

  @Selector([AuditListSelectors._hasActiveFilters])
  static hasActiveFilters(hasActiveFilters: boolean): boolean {
    return hasActiveFilters;
  }

  @Selector([AuditListSelectors._isLoading])
  static isLoading(_isLoading: boolean): boolean {
    return _isLoading;
  }

  @Selector([AuditListState])
  private static _auditItems(state: AuditListStateModel): AuditListItemModel[] {
    const { auditItems, gridConfig } = state;

    return applyGridConfig(auditItems, gridConfig);
  }

  @Selector([AuditListState])
  private static _totalFilteredRecords(state: AuditListStateModel): number {
    const { auditItems, gridConfig } = state;

    return getNumberOfFilteredRecords(auditItems, gridConfig);
  }

  @Selector([AuditListState])
  private static _filterOptions(state: AuditListStateModel): FilterOptions {
    return state.filterOptions;
  }

  @Selector([AuditListState])
  private static _filteringConfig(state: AuditListStateModel): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([AuditListState])
  private static _hasActiveFilters(state: AuditListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([AuditListState])
  private static _isLoading(state: AuditListStateModel): boolean {
    return state.isLoading;
  }
}
