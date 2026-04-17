import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, take, tap } from 'rxjs';

import { NavigateFromActionsListToScheduleListView } from '@customer-portal/data-access/actions/state/actions';
import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import { NavigateFromNotificationsListToScheduleListView } from '@customer-portal/data-access/notifications/state';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import {
  ClearNavigationFilters,
  OverviewSharedStoreService,
} from '@customer-portal/overview-shared';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import { DEFAULT_GRID_CONFIG } from '@customer-portal/shared/constants';
import {
  downloadFileFromByteArray,
  getFilterOptions,
  getToastContentBySeverity,  
  updateGridConfigBasedOnFilters,
} from '@customer-portal/shared/helpers';
import {
  FilterableColumnDefinition,
  ToastSeverity,
} from '@customer-portal/shared/models';
import {
  FilterOptions,
  FilterValue,
  GridConfig,
} from '@customer-portal/shared/models/grid';

import { ScheduleStatusTypes } from '../constants';
import { ScheduleListItemModel } from '../models';
import { ScheduleListMapperService, ScheduleListService } from '../services';
import {
  ApplyNavigationFiltersFromOverview,
  ExportSchedulesExcel,
  ExportSchedulesExcelFail,
  ExportSchedulesExcelSuccess,
  LoadScheduleList,
  LoadScheduleListFail,
  LoadScheduleListSuccess,
  ResetScheduleListState,
  UpdateFilterOptions,
  UpdateGridConfig,
  UpdateScheduleListForReschedule,
  UpdateScheduleListStatusToConfirmed,
} from './actions';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';

export interface ScheduleListStateModel {
  schedules: ScheduleListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

const defaultState: ScheduleListStateModel = {
  schedules: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isLoading: false,
  error: null,
};

@State<ScheduleListStateModel>({
  name: 'scheduleList',
  defaults: defaultState,
})
@Injectable()
export class ScheduleListState {
  constructor(
    private messageService: MessageService,
    private scheduleListService: ScheduleListService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private overviewSharedStore: OverviewSharedStoreService,
  ) {}

  @Action(LoadScheduleList)
  loadScheduleList(ctx: StateContext<ScheduleListStateModel>) {
    ctx.patchState({
      isLoading: true,
      error: '',
      schedules: [],
    });

    return this.scheduleListService.getScheduleList().pipe(
      throwIfNotSuccess(),
      tap((scheduleListDto) => {
        const hasScheduleEditPermisssion =
          this.profileStoreService.hasPermission(
            PermissionCategories.Schedule,
            PermissionsList.Edit,
          )();

        const isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser();
        const siteMasterList =
          this.globalSiteMasterStoreService.siteMasterList();
        const serviceMasterList =
          this.globalServiceMasterStoreService.serviceMasterList();
        const isAdminUser =
          this.settingsCompanyDetailsStoreService.isUserAdmin();
        const schedules = ScheduleListMapperService.mapToScheduleListItemModel(
          scheduleListDto,
          hasScheduleEditPermisssion,
          isDnvUser,
          isAdminUser,
          siteMasterList,
          serviceMasterList,
        );

        if (schedules) {
          ctx.dispatch(new LoadScheduleListSuccess(schedules));
          ctx.dispatch(new UpdateFilterOptions());
        }
      }),
      catchError(() => ctx.dispatch(new LoadScheduleListFail())),
    );
  }

  @Action(LoadScheduleListSuccess)
  loadScheduleListSuccess(
    ctx: StateContext<ScheduleListStateModel>,
    { schedules }: LoadScheduleListSuccess,
  ) {
    ctx.patchState({
      schedules,
      isLoading: false,
      error: '',
    });
  }

  @Action(LoadScheduleListFail)
  loadScheduleListFail(ctx: StateContext<any>) {
    ctx.patchState({
      isLoading: false,
      error: 'Failed to load schedule data',
      schedules: [],
    });
  }

  @Action(UpdateGridConfig)
  updateGridConfig(
    ctx: StateContext<ScheduleListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ): void {
    ctx.patchState({ gridConfig });
    ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<ScheduleListStateModel>): void {
    const { gridConfig, schedules } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'status', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: true },
      { field: 'site', hasColumnDelimiter: false },
      { field: 'city', hasColumnDelimiter: false },
      { field: 'auditType', hasColumnDelimiter: false },
      { field: 'leadAuditor', hasColumnDelimiter: false },
      { field: 'siteRepresentative', hasColumnDelimiter: false },
      { field: 'company', hasColumnDelimiter: false },
      { field: 'startDate', hasColumnDelimiter: false },
      { field: 'endDate', hasColumnDelimiter: false },
      { field: 'siteAuditId', hasColumnDelimiter: true },
    ];

    const filterOptions = getFilterOptions(
      schedules,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ResetScheduleListState)
  resetScheduleListState(ctx: StateContext<ScheduleListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(ExportSchedulesExcel)
  exportSchedulesExcel(ctx: StateContext<ScheduleListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      ScheduleListMapperService.mapToScheduleExcelPayloadDto(filterConfig);

    return this.scheduleListService.exportSchedulesExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportSchedulesExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportSchedulesExcelFail())),
    );
  }

  @Action(ExportSchedulesExcelSuccess)
  exportSchedulesExcelSuccess(
    _: StateContext<ScheduleListStateModel>,
    { input }: ExportSchedulesExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'schedule.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportSchedulesExcelFail)
  exportSchedulesExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ApplyNavigationFiltersFromOverview)
  applyNavigationFiltersFromOverview(
    ctx: StateContext<ScheduleListStateModel>,
  ) {
    return this.overviewSharedStore.overviewNavigationFilters$
      .pipe(take(1))
      .subscribe((overviewCardFilters) => {
        if (overviewCardFilters) {
          const { gridConfig } = ctx.getState();
          const updatedGridConfig = updateGridConfigBasedOnFilters(
            gridConfig,
            overviewCardFilters,
          );
          ctx.patchState({ gridConfig: updatedGridConfig });
          ctx.dispatch(new ClearNavigationFilters());
        }
      });
  }

  @Action(NavigateFromNotificationsListToScheduleListView)
  navigateFromNotificationsToScheduleListView(
    ctx: StateContext<ScheduleListStateModel>,
    { notificationsFilters }: NavigateFromNotificationsListToScheduleListView,
  ) {
    this.updateGridConfigWithNavigationFilters(ctx, notificationsFilters);
  }

  @Action(NavigateFromActionsListToScheduleListView)
  navigateFromActionsToScheduleListView(
    ctx: StateContext<ScheduleListStateModel>,
    { notificationsFilters }: NavigateFromActionsListToScheduleListView,
  ) {
    this.updateGridConfigWithNavigationFilters(ctx, notificationsFilters);
  }

  @Action(UpdateScheduleListForReschedule)
  updateScheduleListForReschedule(
    ctx: StateContext<ScheduleListStateModel>,
    { siteAuditId }: UpdateScheduleListForReschedule,
  ) {
    const state = ctx.getState();

    const schedules = state.schedules.map((item) =>
      item.siteAuditId === siteAuditId
        ? { ...item, status: ScheduleStatusTypes.ToBeConfirmedByDNV }
        : item,
    );

    ctx.patchState({
      schedules,
    });
  }

  @Action(UpdateScheduleListStatusToConfirmed)
  updateScheduleListStatusToConfirmed(
    ctx: StateContext<ScheduleListStateModel>,
    { siteAuditId }: UpdateScheduleListStatusToConfirmed,
  ) {
    const state = ctx.getState();

    const schedules = state.schedules.map((item) =>
      item.siteAuditId === siteAuditId
        ? { ...item, status: ScheduleStatusTypes.Confirmed }
        : item,
    );

    ctx.patchState({
      schedules,
    });
  }

  private updateGridConfigWithNavigationFilters(
    ctx: StateContext<ScheduleListStateModel>,
    notificationsFilters: FilterValue[],
  ): void {
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
