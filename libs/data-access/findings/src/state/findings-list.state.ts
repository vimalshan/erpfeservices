import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, take, tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import {
  ClearNavigationFilters,
  OverviewSharedStoreService,
} from '@customer-portal/overview-shared';
import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import {
  downloadFileFromByteArray,
  getFilterOptions,
  getToastContentBySeverity,  
  updateGridConfigBasedOnFilters,
} from '@customer-portal/shared/helpers';
import {
  FilterableColumnDefinition,
  FilterOptions,
  GridConfig,
  ToastSeverity,
} from '@customer-portal/shared/models';

import { FindingListItemModel } from '../models';
import { FindingsListMapperService, FindingsListService } from '../services';
import {
  ApplyNavigationFiltersFromOverview,
  ExportFindingsExcel,
  ExportFindingsExcelFail,
  ExportFindingsExcelSuccess,
  LoadFindingsList,
  LoadFindingsListFail,
  LoadFindingsListSuccess,
  ResetFindingsListState,
  SetNavigationGridConfig,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';

export interface FindingsListStateModel {
  findingsItems: FindingListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  isLoading: boolean;
  loaded: boolean;
  error: string | null;
}

const defaultState: FindingsListStateModel = {
  findingsItems: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isLoading: false,
  loaded: false,
  error: null,
};

@State<FindingsListStateModel>({
  name: 'findingsList',
  defaults: defaultState,
})
@Injectable()
export class FindingsListState {
  constructor(
    private findingsService: FindingsListService,
    private messageService: MessageService,
    private ts: TranslocoService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private overviewSharedStore: OverviewSharedStoreService,
  ) {}

  @Action(LoadFindingsList)
  loadFindingsList(ctx: StateContext<FindingsListStateModel>) {
    ctx.patchState({
      isLoading: true,
      findingsItems: [],
      error: '',
      loaded: false,
    });

    return this.findingsService.getFindingList().pipe(
      throwIfNotSuccess(),
      tap((findingListDto) => {
        const siteMasterList =
          this.globalSiteMasterStoreService.siteMasterList();
        const serviceMasterList =
          this.globalServiceMasterStoreService.serviceMasterList();
        const findingsItems = FindingsListMapperService.mapToFindingItemModel(
          findingListDto,
          siteMasterList,
          serviceMasterList,
        );

        ctx.dispatch(new LoadFindingsListSuccess(findingsItems));
        ctx.dispatch(new UpdateFilterOptions());
      }),
      catchError(() => ctx.dispatch(new LoadFindingsListFail())),
    );
  }

  @Action(LoadFindingsListSuccess)
  loadFindingsListSuccess(
    ctx: StateContext<FindingsListStateModel>,
    { findingsItems }: LoadFindingsListSuccess,
  ): void {
    ctx.patchState({
      findingsItems,
      isLoading: false,
      error: '',
      loaded: true,
    });
  }

  @Action(LoadFindingsListFail)
  loadFindingsListFail(ctx: StateContext<any>) {
    ctx.patchState({
      findingsItems: [],
      isLoading: false,
      error: 'Failed to load finding data',
      loaded: true,
    });
  }

  @Action(UpdateGridConfig, { cancelUncompleted: true })
  updateGridConfig(
    ctx: StateContext<FindingsListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<FindingsListStateModel>): void {
    const { gridConfig, findingsItems } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'findingNumber', hasColumnDelimiter: false },
      { field: 'response', hasColumnDelimiter: false },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'title', hasColumnDelimiter: false },
      { field: 'companyName', hasColumnDelimiter: false },
      { field: 'category', hasColumnDelimiter: false },
      { field: 'services', hasColumnDelimiter: true },
      { field: 'site', hasColumnDelimiter: true },
      { field: 'country', hasColumnDelimiter: true },
      { field: 'city', hasColumnDelimiter: true },
      { field: 'openDate', hasColumnDelimiter: false },
      { field: 'findingsId', hasColumnDelimiter: true },
    ];

    const filterOptions = getFilterOptions(
      findingsItems,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ExportFindingsExcel)
  exportFindingsExcel(ctx: StateContext<FindingsListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      FindingsListMapperService.mapToFindingExcelPayloadDto(filterConfig);

    return this.findingsService.exportFindingsExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportFindingsExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportFindingsExcelFail())),
    );
  }

  @Action(ExportFindingsExcelSuccess)
  exportFindingsExcelSuccess(
    _: StateContext<FindingsListStateModel>,
    { input }: ExportFindingsExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'finding.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportFindingsExcelFail)
  exportFindingsExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ResetFindingsListState)
  resetFindingsListState(ctx: StateContext<FindingsListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(SetNavigationGridConfig)
  setNavigationGridConfig(
    ctx: StateContext<FindingsListStateModel>,
    { chartNavigationPayload }: SetNavigationGridConfig,
  ) {
    const { gridConfig } = ctx.getState();

    const updatedGridConfig = updateGridConfigBasedOnFilters(
      gridConfig,
      chartNavigationPayload,
    );

    ctx.patchState({
      gridConfig: updatedGridConfig,
    });
  }

  @Action(ApplyNavigationFiltersFromOverview)
  applyNavigationFiltersFromOverview(
    ctx: StateContext<FindingsListStateModel>,
  ) {
    return this.overviewSharedStore.overviewNavigationFilters$
      .pipe(take(1))
      .subscribe((overviewCardFilters) => {
        if (overviewCardFilters) {
          ctx.dispatch(new SetNavigationGridConfig(overviewCardFilters));
          ctx.dispatch(new ClearNavigationFilters());
        }
      });
  }
}
