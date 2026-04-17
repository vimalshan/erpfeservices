import { createSelector, Selector } from '@ngxs/store';

import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import {
  applyGridConfig,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared/models/grid';

import { InvoiceListItemModel } from '../../models';
import { InvoiceListState, InvoiceListStateModel } from '../invoice-list.state';

export class InvoiceListSelectors {
  @Selector([InvoiceListSelectors.invoices, InvoiceListSelectors.gridConfig])
  static invoicesWithGridConfig(
    invoices: InvoiceListItemModel[],
    gridConfig: GridConfig,
  ): InvoiceListItemModel[] {
    return applyGridConfig(invoices, gridConfig);
  }

  static invoicesByIds(ids: string[]) {
    return createSelector(
      [InvoiceListSelectors.invoicesWithGridConfig],
      (invoices: InvoiceListItemModel[]) =>
        invoices.filter((item) => ids.includes(item.invoiceId)),
    );
  }

  @Selector([InvoiceListSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([InvoiceListSelectors.invoices, InvoiceListSelectors.gridConfig])
  static totalFilteredRecords(
    invoices: InvoiceListItemModel[],
    gridConfig: GridConfig,
  ): number {
    return getNumberOfFilteredRecords(invoices, gridConfig);
  }

  @Selector([InvoiceListState])
  static hasActiveFilters(state: InvoiceListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([InvoiceListState])
  static filteringConfig(state: InvoiceListStateModel): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([InvoiceListState])
  static filterOptions(state: InvoiceListStateModel): FilterOptions {
    return state.filterOptions;
  }

  @Selector([InvoiceListState])
  static canUploadData(state: InvoiceListStateModel): boolean {
    return state.canUploadData;
  }

  @Selector([InvoiceListState])
  private static invoices(
    state: InvoiceListStateModel,
  ): InvoiceListItemModel[] {
    return state?.invoices ?? [];
  }

  @Selector([InvoiceListState])
  private static gridConfig(state: InvoiceListStateModel): GridConfig {
    return state?.gridConfig ?? DEFAULT_GRID_CONFIG;
  }

  @Selector([InvoiceListState])
  private static _isLoading(state: InvoiceListStateModel): boolean {
    return state.isLoading;
  }
}
