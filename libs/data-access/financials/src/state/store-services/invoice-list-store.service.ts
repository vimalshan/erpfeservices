import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  FilterValue,
  GridConfig,
} from '@customer-portal/shared';

import { InvoiceListItemModel } from '../../models';
import {
  ApplyNavigationFilters,
  DownloadInvoices,
  ExportInvoicesExcel,
  LoadInvoiceList,
  ResetInvoiceListState,
  SwitchCanUploadData,
  UpdateGridConfig,
  UpdatePlannedPaymentDate,
} from '../actions';
import { InvoiceListSelectors } from '../selectors';

@Injectable()
export class InvoiceListStoreService {
  constructor(private store: Store) {}

  get invoices(): Signal<InvoiceListItemModel[]> {
    return this.store.selectSignal(InvoiceListSelectors.invoicesWithGridConfig);
  }

  getInvoicesByIds(invoiceIds: string[]): Signal<InvoiceListItemModel[]> {
    return this.store.selectSignal(
      InvoiceListSelectors.invoicesByIds(invoiceIds),
    );
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(InvoiceListSelectors.totalFilteredRecords);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(InvoiceListSelectors.hasActiveFilters);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(InvoiceListSelectors.filteringConfig);
  }

  get filteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(InvoiceListSelectors.filteringConfig);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(InvoiceListSelectors.filterOptions);
  }

  get canUploadData(): Signal<boolean> {
    return this.store.selectSignal(InvoiceListSelectors.canUploadData);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(InvoiceListSelectors.isLoading);
  }

  @Dispatch()
  loadInvoiceList = () => new LoadInvoiceList();

  @Dispatch()
  resetInvoiceListState = () => new ResetInvoiceListState();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  switchCanUploadData = (canUploadData: boolean) =>
    new SwitchCanUploadData(canUploadData);

  @Dispatch()
  applyNavigationFilters = (navigationFilter: FilterValue[]) =>
    new ApplyNavigationFilters(navigationFilter);

  @Dispatch()
  exportInvoicesExcel = () => new ExportInvoicesExcel();

  @Dispatch()
  downloadInvoices = (invoiceNumbers: string[], isMultipleDownload = false) =>
    new DownloadInvoices(invoiceNumbers, isMultipleDownload);

  @Dispatch()
  updatePlannedPaymentDate = (invoicesId: string[], date: string) =>
    new UpdatePlannedPaymentDate(invoicesId, date);
}
