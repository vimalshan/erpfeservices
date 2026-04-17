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

import { AuditListItemModel } from '../models';
import { AuditListMapperService, AuditListService } from '../services';
import {
  ApplyNavigationFiltersFromOverview,
  ExportAuditsExcel,
  ExportAuditsExcelFail,
  ExportAuditsExcelSuccess,
  LoadAuditList,
  LoadAuditListFail,
  LoadAuditListSuccess,
  ResetAuditListState,
  SetNavigationGridConfig,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';

export interface AuditListStateModel {
  auditItems: AuditListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

const defaultState: AuditListStateModel = {
  auditItems: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isLoading: false,
  error: null,
};

@State<AuditListStateModel>({
  name: 'auditList',
  defaults: defaultState,
})
@Injectable()
export class AuditListState {
  constructor(
    private auditService: AuditListService,
    private messageService: MessageService,
    private ts: TranslocoService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private overviewSharedStore: OverviewSharedStoreService,
  ) {}

  @Action(LoadAuditList)
  loadAuditList(ctx: StateContext<AuditListStateModel>) {
    ctx.patchState({
      isLoading: true,
    });

    return this.auditService.getAuditList().pipe(
      throwIfNotSuccess(),
      tap((auditListDto) => {
        const siteMasterList =
          this.globalSiteMasterStoreService.siteMasterList();
        const serviceMasterList =
          this.globalServiceMasterStoreService.serviceMasterList();
        const auditItems = AuditListMapperService.mapToAuditItemModel(
          auditListDto,
          siteMasterList,
          serviceMasterList,
        );
        ctx.dispatch(new LoadAuditListSuccess(auditItems));

        ctx.dispatch(new UpdateFilterOptions());
      }),
      catchError(() => ctx.dispatch(new LoadAuditListFail())),
    );
  }

  @Action(LoadAuditListSuccess)
  loadAuditListSuccess(
    ctx: StateContext<AuditListStateModel>,
    { auditItems }: LoadAuditListSuccess,
  ): void {
    ctx.patchState({
      auditItems,
      error: '',
      isLoading: false,
    });
  }

  @Action(LoadAuditListFail)
  loadAuditListFail(ctx: StateContext<any>) {
    const message = getToastContentBySeverity(ToastSeverity.Error);
    const entityType = this.ts.translate('audit');
    message.summary = this.ts.translate('error.loading', { entityType });
    this.messageService.add(message);
    ctx.patchState({
      error: 'Failed to load audit data',
      isLoading: false,
      auditItems: [],
    });
  }

  @Action(UpdateGridConfig, { cancelUncompleted: true })
  updateGridConfig(
    ctx: StateContext<AuditListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<AuditListStateModel>): void {
    const { gridConfig, auditItems } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'auditNumber', hasColumnDelimiter: false },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: true },
      { field: 'site', hasColumnDelimiter: true },
      { field: 'country', hasColumnDelimiter: true },
      { field: 'city', hasColumnDelimiter: true },
      { field: 'companyName', hasColumnDelimiter: false },
      { field: 'type', hasColumnDelimiter: false },
      { field: 'startDate', hasColumnDelimiter: false },
      { field: 'endDate', hasColumnDelimiter: false },
      { field: 'leadAuthor', hasColumnDelimiter: false },
    ];

    const filterOptions = getFilterOptions(
      auditItems,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ExportAuditsExcel)
  exportAuditsExcel(ctx: StateContext<AuditListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      AuditListMapperService.mapToAuditExcelPayloadDto(filterConfig);

    return this.auditService.exportAuditsExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportAuditsExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportAuditsExcelFail())),
    );
  }

  @Action(ExportAuditsExcelSuccess)
  exportAuditsExcelSuccess(
    _: StateContext<AuditListStateModel>,
    { input }: ExportAuditsExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'audit.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportAuditsExcelFail)
  exportAuditsExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ResetAuditListState)
  resetAuditListState(ctx: StateContext<AuditListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(SetNavigationGridConfig)
  setNavigationGridConfig(
    ctx: StateContext<AuditListStateModel>,
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
  applyNavigationFiltersFromOverview(ctx: StateContext<AuditListStateModel>) {
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
