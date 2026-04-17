import { Injectable } from '@angular/core';
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

import { CertificateListItemModel } from '../models';
import {
  CertificateListMapperService,
  CertificateListService,
} from '../services';
import {
  ApplyNavigationFiltersFromOverview,
  ExportCertificatesExcel,
  ExportCertificatesExcelFail,
  ExportCertificatesExcelSuccess,
  LoadCertificateList,
  LoadCertificateListFail,
  LoadCertificateListSuccess,
  ResetCertificateListState,
  SetNavigationGridConfig,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';

export interface CertificateListStateModel {
  certificates: CertificateListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

const defaultState: CertificateListStateModel = {
  certificates: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isLoading: false,
  error: null,
};

@State<CertificateListStateModel>({
  name: 'certificateList',
  defaults: defaultState,
})
@Injectable()
export class CertificateListState {
  constructor(
    private certificateListService: CertificateListService,
    private messageService: MessageService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private overviewSharedStore: OverviewSharedStoreService,
  ) {}

  @Action(LoadCertificateList)
  loadCertificateList(ctx: StateContext<CertificateListStateModel>) {
    ctx.patchState({
      isLoading: true,
      error: '',
      certificates: [],
    });

    return this.certificateListService.getCertificateList().pipe(
      throwIfNotSuccess(),
      tap((certificateListDto) => {
        const siteMasterList =
          this.globalSiteMasterStoreService.siteMasterList();
        const serviceMasterList =
          this.globalServiceMasterStoreService.serviceMasterList();
        const certificates =
          CertificateListMapperService.mapToCertificateListItemModel(
            certificateListDto,
            siteMasterList,
            serviceMasterList,
          );

        if (certificates) {
          ctx.dispatch(new LoadCertificateListSuccess(certificates));

          ctx.dispatch(new UpdateFilterOptions());
        }
      }),
      catchError(() => ctx.dispatch(new LoadCertificateListFail())),
    );
  }

  @Action(LoadCertificateListSuccess)
  loadCertificateListSuccess(
    ctx: StateContext<CertificateListStateModel>,
    { certificates }: LoadCertificateListSuccess,
  ) {
    ctx.patchState({
      certificates,
      isLoading: false,
      error: '',
    });
  }

  @Action(LoadCertificateListFail)
  loadCertificateListFail(ctx: StateContext<any>) {
    ctx.patchState({
      isLoading: false,
      certificates: [],
      error: 'Failed to load Certificate data',
    });
  }

  @Action(UpdateGridConfig, { cancelUncompleted: true })
  updateGridConfig(
    ctx: StateContext<CertificateListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<CertificateListStateModel>): void {
    const { gridConfig, certificates } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'certificateId', hasColumnDelimiter: false },
      { field: 'certificateNumber', hasColumnDelimiter: false },
      { field: 'companyName', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: true },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'site', hasColumnDelimiter: true },
      { field: 'city', hasColumnDelimiter: true },
      { field: 'validUntil', hasColumnDelimiter: false },
      { field: 'issuedDate', hasColumnDelimiter: false },
    ];

    const filterOptions = getFilterOptions(
      certificates,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ExportCertificatesExcel)
  exportCertificatesExcel(ctx: StateContext<CertificateListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };

    const payload =
      CertificateListMapperService.mapToCertificateExcelPayloadDto(
        filterConfig,
      );

    return this.certificateListService.exportCertificatesExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportCertificatesExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportCertificatesExcelFail())),
    );
  }

  @Action(ExportCertificatesExcelSuccess)
  exportCertificatesExcelSuccess(
    _: StateContext<CertificateListStateModel>,
    { input }: ExportCertificatesExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'certificates.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportCertificatesExcelFail)
  exportCertificatesExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ResetCertificateListState)
  resetCertificateListState(ctx: StateContext<CertificateListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(SetNavigationGridConfig)
  setNavigationGridConfig(
    ctx: StateContext<CertificateListStateModel>,
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
    ctx: StateContext<CertificateListStateModel>,
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
