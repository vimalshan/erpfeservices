import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs';

import { NavigateFromNotificationsListToContractsListView } from '@customer-portal/data-access/notifications/state';
import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { downloadFileFromByteArray } from '@customer-portal/shared/helpers/download';
import {
  getFilterOptions,
  updateGridConfigBasedOnFilters,
} from '@customer-portal/shared/helpers/grid';
import {
  FilterableColumnDefinition,
  ToastSeverity,
} from '@customer-portal/shared/models';
import { FilterOptions, GridConfig } from '@customer-portal/shared/models/grid';

import { ContractsListItemModel } from '../models';
import { ContractsListMapperService, ContractsListService } from '../services';
import {
  ExportContractsExcel,
  ExportContractsExcelFail,
  ExportContractsExcelSuccess,
  LoadContractsList,
  LoadContractsListFail,
  LoadContractsListSuccess,
  ResetContractsListState,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';

export interface ContractsListStateModel {
  contracts: ContractsListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

const defaultState: ContractsListStateModel = {
  contracts: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isLoading: false,
  error: null,
};

@State<ContractsListStateModel>({
  name: 'contractsList',
  defaults: defaultState,
})
@Injectable()
export class ContractsListState {
  constructor(
    private contractsListService: ContractsListService,
    private messageService: MessageService,
  ) {}

  @Action(LoadContractsList)
  loadContractsList(ctx: StateContext<ContractsListStateModel>) {
    ctx.patchState({
      isLoading: true,
      error: '',
      contracts: [],
    });

    return this.contractsListService.getContractsList().pipe(
      throwIfNotSuccess(),
      tap((contractsListDto) => {
        const contracts =
          ContractsListMapperService.mapToContractListItemModel(
            contractsListDto,
          );

        if (contracts) {
          ctx.dispatch(new LoadContractsListSuccess(contracts));
          ctx.dispatch(new UpdateFilterOptions());
        }
      }),
      catchError(() => ctx.dispatch(new LoadContractsListFail())),
    );
  }

  @Action(LoadContractsListSuccess)
  loadContractsListSuccess(
    ctx: StateContext<ContractsListStateModel>,
    { contracts }: LoadContractsListSuccess,
  ) {
    ctx.patchState({
      contracts,
      isLoading: false,
      error: '',
    });
  }

  @Action(LoadContractsListFail)
  loadContractsListFail(ctx: StateContext<any>) {
    ctx.patchState({
      contracts: [],
      isLoading: false,
      error: 'Failed to load Contract data',
    });
  }

  @Action(UpdateGridConfig)
  updateGridConfig(
    ctx: StateContext<ContractsListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ): void {
    ctx.patchState({ gridConfig });
    ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<ContractsListStateModel>): void {
    const { gridConfig, contracts } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'contractName', hasColumnDelimiter: false },
      { field: 'contractType', hasColumnDelimiter: false },
      { field: 'company', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: false },
      { field: 'sites', hasColumnDelimiter: false },
      { field: 'dateAdded', hasColumnDelimiter: false },
    ];

    const filterOptions = getFilterOptions(
      contracts,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ExportContractsExcel)
  exportContractsExcel(ctx: StateContext<ContractsListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      ContractsListMapperService.mapToContractsExcelPayloadDto(filterConfig);

    return this.contractsListService.exportContractsExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportContractsExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportContractsExcelFail())),
    );
  }

  @Action(ExportContractsExcelSuccess)
  exportContractsExcelSuccess(
    _: StateContext<ContractsListStateModel>,
    { input }: ExportContractsExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'contracts.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportContractsExcelFail)
  exportContractsExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ResetContractsListState)
  resetScheduleListState(ctx: StateContext<ContractsListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(NavigateFromNotificationsListToContractsListView)
  navigateFromNotificationToContractsListView(
    ctx: StateContext<ContractsListStateModel>,
    { notificationsFilters }: NavigateFromNotificationsListToContractsListView,
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
}
