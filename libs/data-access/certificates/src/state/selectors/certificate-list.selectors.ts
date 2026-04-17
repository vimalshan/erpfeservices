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

import { CertificateListItemModel } from '../../models';
import {
  CertificateListState,
  CertificateListStateModel,
} from '../certificate-list.state';

export class CertificateListSelectors {
  @Selector([CertificateListSelectors._certificates])
  static certificates(
    certificates: CertificateListItemModel[],
  ): CertificateListItemModel[] {
    return certificates;
  }

  @Selector([CertificateListSelectors._totalFilteredRecords])
  static totalFilteredRecords(totalFilteredRecords: number): number {
    return totalFilteredRecords;
  }

  @Selector([CertificateListSelectors._filterOptions])
  static filterOptions(filterOptions: FilterOptions): FilterOptions {
    return filterOptions;
  }

  @Selector([CertificateListSelectors._filteringConfig])
  static filteringConfig(filteringConfig: FilteringConfig): FilteringConfig {
    return filteringConfig;
  }

  @Selector([CertificateListSelectors._hasActiveFilters])
  static hasActiveFilters(hasActiveFilters: boolean): boolean {
    return hasActiveFilters;
  }

  @Selector([CertificateListSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([CertificateListState])
  private static _certificates(
    state: CertificateListStateModel,
  ): CertificateListItemModel[] {
    const { certificates, gridConfig } = state;

    return applyGridConfig(certificates, gridConfig);
  }

  @Selector([CertificateListState])
  private static _totalFilteredRecords(
    state: CertificateListStateModel,
  ): number {
    const { certificates, gridConfig } = state;

    return getNumberOfFilteredRecords(certificates, gridConfig);
  }

  @Selector([CertificateListState])
  private static _filterOptions(
    state: CertificateListStateModel,
  ): FilterOptions {
    return state.filterOptions;
  }

  @Selector([CertificateListState])
  private static _filteringConfig(
    state: CertificateListStateModel,
  ): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([CertificateListState])
  private static _hasActiveFilters(state: CertificateListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([CertificateListState])
  private static _isLoading(state: CertificateListStateModel): boolean {
    return state.isLoading;
  }
}
