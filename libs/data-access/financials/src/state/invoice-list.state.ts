import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs';

import { NavigateFromNotificationsListToFinancialsListView } from '@customer-portal/data-access/notifications/state';
import {
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import {
  downloadFileFromByteArray,
  getContentType,
  getToastContentBySeverity,
} from '@customer-portal/shared/helpers';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import {
  getFilterOptions,
  updateGridConfigBasedOnFilters,
} from '@customer-portal/shared/helpers/grid';
import {
  FilterableColumnDefinition,
  ToastSeverity,
} from '@customer-portal/shared/models';
import { FilterOptions, GridConfig } from '@customer-portal/shared/models/grid';

import { InvoiceListDto } from '../dtos';
import { InvoiceListItemModel } from '../models';
import { InvoiceListMapperService, InvoiceListService } from '../services';
import {
  ApplyNavigationFilters,
  DownloadInvoices,
  DownloadInvoicesFail,
  DownloadInvoicesSuccess,
  ExportInvoicesExcel,
  ExportInvoicesExcelFail,
  ExportInvoicesExcelSuccess,
  LoadInvoiceList,
  LoadInvoiceListFail,
  LoadInvoiceListSuccess,
  ResetInvoiceListState,
  SwitchCanUploadData,
  UpdateFilterOptions,
  UpdateGridConfig,
  UpdatePlannedPaymentDate,
  UpdatePlannedPaymentDateSuccess,
} from './actions';

export interface InvoiceListStateModel {
  invoices: InvoiceListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  contactId: string | null;
  canUploadData: boolean;
  isLoading: boolean;
  error: string | null;
}

const defaultState: InvoiceListStateModel = {
  invoices: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  contactId: null,
  canUploadData: false,
  isLoading: false,
  error: null,
};

@State<InvoiceListStateModel>({
  name: 'invoiceList',
  defaults: defaultState,
})
@Injectable()
export class InvoiceListState {
  constructor(
    private invoiceListService: InvoiceListService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    private messageService: MessageService,
    private ts: TranslocoService,
  ) {}

  @Action(LoadInvoiceList)
  loadInvoiceList(ctx: StateContext<InvoiceListStateModel>) {
    ctx.patchState({
      isLoading: true,
      error: '',
    });

    return this.invoiceListService.getInvoiceList().pipe(
      throwIfNotSuccess(),
      tap((items: InvoiceListDto) => {
        const isAdminUser =
          this.settingsCompanyDetailsStoreService.isUserAdmin();
        const isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser();
        const invoices = InvoiceListMapperService.mapToInvoiceItemModel(
          items.data.items,
          isAdminUser,
          isDnvUser,
        );

        if (invoices) {
          ctx.dispatch(new LoadInvoiceListSuccess(invoices));
          ctx.dispatch(new UpdateFilterOptions());
        }
      }),
      catchError(() => ctx.dispatch(new LoadInvoiceListFail())),
    );
  }

  @Action(LoadInvoiceListSuccess)
  loadInvoiceListSuccess(
    ctx: StateContext<InvoiceListStateModel>,
    { invoices }: LoadInvoiceListSuccess,
  ) {
    ctx.patchState({
      invoices,
      isLoading: false,
      error: '',
    });
  }

  @Action(LoadInvoiceListFail)
  loadInvoiceListFail(ctx: StateContext<any>) {
    ctx.patchState({
      invoices: [],
      error: 'Failed to load invoice data',
      isLoading: false,
    });
  }

  @Action(ResetInvoiceListState)
  resetInvoiceListState(ctx: StateContext<InvoiceListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(UpdateGridConfig)
  updateGridConfig(
    ctx: StateContext<InvoiceListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ): void {
    ctx.patchState({ gridConfig });
    ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<InvoiceListStateModel>): void {
    const { gridConfig, invoices } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'invoiceId', hasColumnDelimiter: false },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'amount', hasColumnDelimiter: false },
      { field: 'billingAddress', hasColumnDelimiter: false },
      { field: 'dueDate', hasColumnDelimiter: false },
      { field: 'plannedPaymentDate', hasColumnDelimiter: false },
      { field: 'referenceNumber', hasColumnDelimiter: false },
      { field: 'issueDate', hasColumnDelimiter: false },
      { field: 'contactPerson', hasColumnDelimiter: false },
      { field: 'company', hasColumnDelimiter: false },
      { field: 'originalInvoiceNumber', hasColumnDelimiter: false },
    ];
    const filterOptions = getFilterOptions(
      invoices,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(SwitchCanUploadData)
  switchCanUploadData(
    ctx: StateContext<InvoiceListStateModel>,
    { canUploadData }: SwitchCanUploadData,
  ) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      canUploadData,
    });
  }

  @Action(ExportInvoicesExcel)
  exportInvoicesExcel(ctx: StateContext<InvoiceListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      InvoiceListMapperService.mapToInvoiceExcelPayloadDto(filterConfig);

    return this.invoiceListService.exportInvoices(payload).pipe(
      tap((result) => ctx.dispatch(new ExportInvoicesExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportInvoicesExcelFail())),
    );
  }

  @Action(ExportInvoicesExcelSuccess)
  exportInvoicesExcelSuccess(
    _: StateContext<InvoiceListStateModel>,
    { input }: ExportInvoicesExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'financial.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportInvoicesExcelFail)
  exportInvoicesExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(NavigateFromNotificationsListToFinancialsListView)
  navigateFromNotificationsToFinancialsListView(
    ctx: StateContext<InvoiceListStateModel>,
    { notificationsFilters }: NavigateFromNotificationsListToFinancialsListView,
  ) {
    const { gridConfig } = ctx.getState();

    const updatedGridConfig = updateGridConfigBasedOnFilters(
      gridConfig,
      notificationsFilters,
    );

    ctx.patchState({
      gridConfig: updatedGridConfig,
    });
  }

  @Action(ApplyNavigationFilters)
  applyNavigationFilters(
    ctx: StateContext<InvoiceListStateModel>,
    { navigationFilter }: ApplyNavigationFilters,
  ) {
    const { gridConfig } = ctx.getState();
    const updatedGridConfig = updateGridConfigBasedOnFilters(
      gridConfig,
      navigationFilter,
    );
    ctx.patchState({
      gridConfig: updatedGridConfig,
    });
  }

  @Action(DownloadInvoices)
  downloadInvoices(
    ctx: StateContext<InvoiceListStateModel>,
    { invoiceNumbers, isMultipleDownload }: DownloadInvoices,
  ) {
    if (isMultipleDownload) {
      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.DownloadStart),
      );
    }

    return this.invoiceListService.downloadInvoices(invoiceNumbers).pipe(
      tap((result) =>
        ctx.dispatch(
          new DownloadInvoicesSuccess(
            result.content,
            result.fileName,
            isMultipleDownload,
          ),
        ),
      ),
      catchError(() => ctx.dispatch(new DownloadInvoicesFail())),
    );
  }

  @Action(DownloadInvoicesSuccess)
  downloadInvoicesSuccess(
    _: StateContext<InvoiceListStateModel>,
    { input, fileName }: DownloadInvoicesSuccess,
  ) {
    downloadFileFromByteArray(input, fileName, getContentType(fileName));

    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(DownloadInvoicesFail)
  downloadInvoicesFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadError),
    );
  }

  @Action(UpdatePlannedPaymentDate)
  updatePlannedPaymentDate(
    ctx: StateContext<InvoiceListStateModel>,
    { invoiceId, date }: UpdatePlannedPaymentDate,
  ) {
    return this.invoiceListService
      .updatePlannedPaymentDate(invoiceId, date)
      .pipe(
        tap((result: any) => {
          if (result.data.UpdatePlannedPaymentDate.isSuccess) {
            ctx.dispatch(new UpdatePlannedPaymentDateSuccess());
          }
        }),
      );
  }

  @Action(UpdatePlannedPaymentDateSuccess)
  updatePlannedPaymentDateSuccess(ctx: StateContext<InvoiceListStateModel>) {
    const message = getToastContentBySeverity(ToastSeverity.Success);
    message.summary = this.ts.translate(
      'invoices.updatePlannedPaymentDate.success',
    );
    this.messageService.add(message);

    ctx.dispatch(new LoadInvoiceList());
  }
}
