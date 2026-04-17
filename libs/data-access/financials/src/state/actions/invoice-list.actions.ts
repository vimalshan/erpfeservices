import { FilterValue, GridConfig } from '@customer-portal/shared';

import { InvoiceListItemModel } from '../../models';

export class LoadInvoiceList {
  static readonly type = '[Invoice List] Load Invoice List';
}

export class LoadInvoiceListSuccess {
  static readonly type = '[Invoice List] Load Invoices List Success';

  constructor(public invoices: InvoiceListItemModel[]) {}
}
export class LoadInvoiceListFail {
  static readonly type = '[Invoice List] Load Invoice List Fail';
}
export class ResetInvoiceListState {
  static readonly type = '[Invoice List] Reset Invoices List State';
}

export class UpdateGridConfig {
  static readonly type = '[Invoice List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Invoice List] Update Filter Options';
}
export class ExportInvoicesExcel {
  static readonly type = '[Invoice List] Export Invoices Excel';
}

export class ExportInvoicesExcelSuccess {
  static readonly type = '[Invoice List] Export Invoices Excel Success';

  constructor(public input: number[]) {}
}

export class ExportInvoicesExcelFail {
  static readonly type = '[Invoice List] Export Invoices Excel Fail';
}

export class SwitchCanUploadData {
  static readonly type = '[Invoice List] Switch Can Upload Data';

  constructor(public canUploadData: boolean) {}
}

export class ApplyNavigationFilters {
  static readonly type = '[Invoice List] Apply Navigation Filter';

  constructor(public navigationFilter: FilterValue[]) {}
}

export class DownloadInvoices {
  static readonly type = '[Invoice List] Download Invoices';

  constructor(
    public invoiceNumbers: string[],
    public isMultipleDownload: boolean,
  ) {}
}

export class DownloadInvoicesSuccess {
  static readonly type = '[Invoice List] Download Invoices Success';

  constructor(
    public input: number[],
    public fileName: string,
    public isMultipleDownload: boolean,
  ) {}
}

export class DownloadInvoicesFail {
  static readonly type = '[Invoice List] Download Invoices Fail';
}

export class UpdatePlannedPaymentDate {
  static readonly type = '[Invoice List] Update Planned Payment Date';

  constructor(
    public invoiceId: string[],
    public date: string,
  ) {}
}

export class UpdatePlannedPaymentDateSuccess {
  static readonly type = '[Invoice List] Update Planned Payment Date Success';
}
