import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, combineLatest, EMPTY, switchMap, tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import { RouteStoreService } from '@customer-portal/router';
import {
  COLUMN_DELIMITER,
  DEFAULT_GRID_CONFIG,
} from '@customer-portal/shared/constants';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { downloadFileFromByteArray } from '@customer-portal/shared/helpers/download';
import { getFilterOptionsForColumn } from '@customer-portal/shared/helpers/grid';
import { ToastSeverity } from '@customer-portal/shared/models';
import { FilterOptions, GridConfig } from '@customer-portal/shared/models/grid';

import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../models';
import {
  AuditDetailsMapperService,
  AuditDetailsService,
  AuditDocumentsListService,
} from '../services';
import {
  ExportAuditFindingsExcel,
  ExportSubAuditExcelSuccess,
  ExportSubAuditsExcel,
  LoadAuditDetails,
  LoadAuditDetailsSuccess,
  LoadAuditDocumentsList,
  LoadAuditDocumentsListFail,
  LoadAuditDocumentsListSuccess,
  LoadAuditFindingsList,
  LoadAuditFindingsListFail,
  LoadAuditFindingsListSuccess,
  LoadAuditHeaderDocDetails,
  LoadAuditSitesList,
  LoadAuditSitesListFail,
  LoadAuditSitesListSuccess,
  LoadSubAuditList,
  LoadSubAuditListFail,
  LoadSubAuditListSuccess,
  ResetAuditDetailsState,
  UpdateAuditDocumentsListFilterOptions,
  UpdateAuditDocumentsListGridConfig,
  UpdateAuditFindingListFilterOptions,
  UpdateAuditFindingListGridConfig,
  UpdateAuditSitesListFilterOptions,
  UpdateAuditSitesListGridConfig,
  UpdateSubAuditListFilterOptions,
  UpdateSubAuditListGridConfig,
} from './actions';

export interface AuditDetailsStateModel {
  auditDetails: AuditDetailsModel;
  auditId: string;
  subAuditGridConfig: GridConfig;
  subAuditFilterOptions: FilterOptions;
  auditFindingGridConfig: GridConfig;
  auditFindingFilterOptions: FilterOptions;
  siteItemsGridConfig: GridConfig;
  siteItemsFilterOptions: FilterOptions;
  auditDocumentsGridConfig: GridConfig;
  auditDocumentsFilterOptions: FilterOptions;
  loading: boolean;
  error?: string;
  subaudit: {
    loading: boolean;
    error: string | null;
    list: SubAuditListItemModel[];
  };
  findings: {
    loading: boolean;
    error: string | null;
    list: AuditFindingListItemModel[];
  };
  sites: {
    loading: boolean;
    error: string | null;
    list: AuditSiteListItemModel[];
  };
  documents: {
    loading: boolean;
    error: string | null;
    list: AuditDocumentListItemModel[];
  };
}

const defaultState: AuditDetailsStateModel = {
  auditId: '',
  auditDetails: {
    auditNumber: 0,
    header: {
      status: '',
      services: '',
      siteName: '',
      siteAddress: '',
      startDate: '',
      endDate: '',
      auditor: '',
      auditorTeam: [],
      auditPlanDocId: [],
      auditReportDocId: [],
    },
  },
  loading: false,
  error: '',
  subAuditGridConfig: DEFAULT_GRID_CONFIG,
  subAuditFilterOptions: {},
  auditFindingGridConfig: DEFAULT_GRID_CONFIG,
  auditFindingFilterOptions: {},
  siteItemsGridConfig: DEFAULT_GRID_CONFIG,
  siteItemsFilterOptions: {},
  auditDocumentsGridConfig: DEFAULT_GRID_CONFIG,
  auditDocumentsFilterOptions: {},
  subaudit: {
    loading: false,
    error: '',
    list: [],
  },
  findings: {
    loading: false,
    error: '',
    list: [],
  },
  sites: {
    loading: false,
    error: '',
    list: [],
  },
  documents: {
    loading: false,
    error: '',
    list: [],
  },
};

@State<AuditDetailsStateModel>({
  name: 'auditDetails',
  defaults: defaultState,
})
@Injectable()
export class AuditDetailsState {
  constructor(
    private auditDetailsService: AuditDetailsService,
    private routeStoreService: RouteStoreService,
    private auditDocumentsListService: AuditDocumentsListService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private messageService: MessageService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
  ) {}

  // #region AuditDetails
  @Action(LoadAuditDetails)
  loadAuditDetails(ctx: StateContext<AuditDetailsStateModel>) {
    ctx.patchState({ loading: true, error: '' });

    return this.routeStoreService.getPathParamByKey('auditId').pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getAuditDetails(Number(auditId)).pipe(
          throwIfNotSuccess(),
          tap((auditDetailsDto) => {
            const auditDetails =
              AuditDetailsMapperService.mapToAuditDetailsModel(auditDetailsDto);

            if (auditDetails) {
              ctx.dispatch(new LoadAuditDetailsSuccess(auditDetails, auditId));
              ctx.dispatch(new LoadAuditHeaderDocDetails(auditId));
            }
          }),
          catchError((error) => {
            ctx.patchState({
              loading: false,
              error: error.message ?? 'Audit details load failed',
            });
            this.messageService.add(
              getToastContentBySeverity(ToastSeverity.Error),
            );

            return EMPTY;
          }),
        ),
      ),
    );
  }

  @Action(LoadAuditHeaderDocDetails)
  loadAuditHeaderDocDetails(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditId }: LoadAuditHeaderDocDetails,
  ) {
    return this.auditDocumentsListService
      .getAuditDocumentsList(auditId, true, true)
      .pipe(
        throwIfNotSuccess(),
        tap((auditDocumentsListDto) => {
          const { auditPlanDocId, auditReportDocId } =
            AuditDetailsMapperService.extractPlanAndReportDocIds(
              auditDocumentsListDto,
            );

          const currentDetails = ctx.getState().auditDetails;
          ctx.patchState({
            auditDetails: {
              ...currentDetails,
              header: {
                ...currentDetails.header,
                auditPlanDocId,
                auditReportDocId,
              },
            },
          });
        }),
        catchError(() => EMPTY),
      );
  }

  @Action(LoadAuditDetailsSuccess)
  loadAuditDetailsSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDetails, auditId }: LoadAuditDetailsSuccess,
  ): void {
    ctx.patchState({ auditDetails, auditId, loading: false, error: '' });
  }

  @Action(ResetAuditDetailsState)
  resetAuditDetailsState(ctx: StateContext<AuditDetailsStateModel>) {
    ctx.setState(defaultState);
  }

  // #endregion AuditDetails

  // #region AuditFindingList
  @Action(LoadAuditFindingsList)
  loadAuditFindingsList(ctx: StateContext<AuditDetailsStateModel>) {
    const currentState = ctx.getState();
    ctx.patchState({
      ...currentState,
      findings: {
        ...currentState.findings,
        loading: true,
        error: '',
      },
    });

    return this.routeStoreService.getPathParamByKey('auditId').pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getAuditFindingList(Number(auditId)).pipe(
          throwIfNotSuccess(),
          tap((auditFindingListDto) => {
            const siteMasterList =
              this.globalSiteMasterStoreService.siteMasterList();
            const serviceMasterList =
              this.globalServiceMasterStoreService.serviceMasterList();
            const findingsItems =
              AuditDetailsMapperService.mapToAuditFindingListItemModel(
                auditFindingListDto,
                siteMasterList,
                serviceMasterList,
              );

            ctx.dispatch(new LoadAuditFindingsListSuccess(findingsItems));
            ctx.dispatch(
              new UpdateAuditFindingListFilterOptions(findingsItems),
            );
          }),
        ),
      ),
      catchError(() => ctx.dispatch(new LoadAuditFindingsListFail())),
    );
  }

  @Action(LoadAuditFindingsListSuccess)
  loadFindingsListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditFindingItems }: LoadAuditFindingsListSuccess,
  ): void {
    ctx.patchState({
      findings: {
        error: '',
        list: auditFindingItems,
        loading: false,
      },
    });
  }

  @Action(LoadAuditFindingsListFail)
  loadFindingsListFail(ctx: StateContext<any>) {
    ctx.patchState({
      findings: {
        error: 'Failed to load audit findings data',
        list: [],
        loading: false,
      },
    });
  }

  @Action(UpdateAuditFindingListFilterOptions)
  updateAuditFindingListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditFindingItems }: UpdateAuditFindingListFilterOptions,
  ): void {
    const auditFindingFilterOptions = {
      findingNumber: getFilterOptionsForColumn(
        auditFindingItems,
        'findingNumber',
      ),
      status: getFilterOptionsForColumn(auditFindingItems, 'status'),
      title: getFilterOptionsForColumn(auditFindingItems, 'title'),
      category: getFilterOptionsForColumn(auditFindingItems, 'category'),
      companyName: getFilterOptionsForColumn(auditFindingItems, 'companyName'),
      services: getFilterOptionsForColumn(
        auditFindingItems,
        'services',
        COLUMN_DELIMITER,
      ),
      site: getFilterOptionsForColumn(
        auditFindingItems,
        'site',
        COLUMN_DELIMITER,
      ),
      city: getFilterOptionsForColumn(
        auditFindingItems,
        'city',
        COLUMN_DELIMITER,
      ),
      auditNumber: getFilterOptionsForColumn(auditFindingItems, 'auditNumber'),
    };

    ctx.patchState({ auditFindingFilterOptions });
  }

  @Action(UpdateAuditFindingListGridConfig)
  updateAuditFindingListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditFindingGridConfig }: UpdateAuditFindingListGridConfig,
  ): void {
    ctx.patchState({ auditFindingGridConfig });
  }

  @Action(ExportAuditFindingsExcel)
  exportAuditFindingsExcel(ctx: StateContext<AuditDetailsStateModel>) {
    const filterConfig = {
      ...ctx.getState().auditFindingGridConfig.filtering,
    };
    const { auditId } = ctx.getState();
    const payload = AuditDetailsMapperService.mapToAuditFindingsExcelPayloadDto(
      filterConfig,
      auditId,
    );

    return this.auditDetailsService.exportAuditFindingsExcel(payload).pipe(
      tap((result) => {
        downloadFileFromByteArray(
          result,
          'auditFindings.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        this.messageService.add(
          getToastContentBySeverity(ToastSeverity.DownloadSuccess),
        );
      }),
    );
  }

  // #endregion AuditFindingList

  // #region SubAuditList
  @Action(LoadSubAuditList)
  loadSubAuditList(ctx: StateContext<AuditDetailsStateModel>) {
    const currentState = ctx.getState();
    ctx.patchState({
      ...currentState,
      subaudit: {
        ...currentState.subaudit,
        loading: true,
        error: '',
      },
    });

    return combineLatest([
      this.routeStoreService.getPathParamByKey('auditId'),
    ]).pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getSubAuditList(+auditId).pipe(
          throwIfNotSuccess(),
          tap((subAuditListDto) => {
            const siteMasterList =
              this.globalSiteMasterStoreService.siteMasterList();
            const serviceMasterList =
              this.globalServiceMasterStoreService.serviceMasterList();
            const subAuditItems =
              AuditDetailsMapperService.mapToSubAuditItemModel(
                subAuditListDto,
                siteMasterList,
                serviceMasterList,
              );

            ctx.dispatch(new LoadSubAuditListSuccess(subAuditItems));

            ctx.dispatch(new UpdateSubAuditListFilterOptions(subAuditItems));
          }),
        ),
      ),
      catchError(() => ctx.dispatch(new LoadSubAuditListFail())),
    );
  }

  @Action(LoadSubAuditListSuccess)
  loadSubAuditListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { subAuditItems }: LoadSubAuditListSuccess,
  ): void {
    ctx.patchState({
      subaudit: {
        list: subAuditItems,
        loading: false,
        error: '',
      },
    });
  }

  @Action(LoadSubAuditListFail)
  LoadSubAuditListFail(ctx: StateContext<any>) {
    ctx.patchState({
      subaudit: {
        loading: false,
        list: [],
        error: 'Failed to load sub audit data',
      },
    });
  }

  @Action(UpdateSubAuditListFilterOptions)
  updateSubAuditListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { subAuditItems }: UpdateSubAuditListFilterOptions,
  ): void {
    const subAuditFilterOptions = {
      auditNumber: getFilterOptionsForColumn(subAuditItems, 'auditNumber'),
      status: getFilterOptionsForColumn(subAuditItems, 'status'),
      service: getFilterOptionsForColumn(
        subAuditItems,
        'service',
        COLUMN_DELIMITER,
      ),
      site: getFilterOptionsForColumn(subAuditItems, 'site'),
      city: getFilterOptionsForColumn(subAuditItems, 'city', COLUMN_DELIMITER),
      auditorTeam: getFilterOptionsForColumn(
        subAuditItems,
        'auditorTeam',
        COLUMN_DELIMITER,
      ),
    };

    ctx.patchState({ subAuditFilterOptions });
  }

  @Action(UpdateSubAuditListGridConfig)
  updateSubAuditFindingListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    { subAuditGridConfig }: UpdateSubAuditListGridConfig,
  ): void {
    ctx.patchState({ subAuditGridConfig });
  }

  @Action(ExportSubAuditsExcel)
  ExportSubAuditsExcel(ctx: StateContext<AuditDetailsStateModel>) {
    const filterConfig = { ...ctx.getState().subAuditGridConfig.filtering };
    const { auditId } = ctx.getState();
    const payload = AuditDetailsMapperService.mapToSubAuditExcelPayloadDto(
      +auditId,
      filterConfig,
    );

    return this.auditDetailsService.exportSubAuditsExcel(payload).pipe(
      tap({
        next: (result) => {
          ctx.dispatch(new ExportSubAuditExcelSuccess(result));
          downloadFileFromByteArray(
            result,
            'subaudit.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          );
          this.messageService.add(
            getToastContentBySeverity(ToastSeverity.DownloadSuccess),
          );
        },
      }),
    );
  }

  // #endregion SubAuditList

  // #region SitesList
  @Action(LoadAuditSitesList)
  loadSitesList(ctx: StateContext<AuditDetailsStateModel>) {
    const currentState = ctx.getState();
    ctx.patchState({
      ...currentState,
      sites: {
        ...currentState.sites,
        loading: true,
        error: '',
      },
    });

    return combineLatest([
      this.routeStoreService.getPathParamByKey('auditId'),
    ]).pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getSitesList(+auditId).pipe(
          throwIfNotSuccess(),
          tap((sitesListDto) => {
            const siteItems =
              AuditDetailsMapperService.mapToAuditSitesItemModel(sitesListDto);

            ctx.dispatch(new LoadAuditSitesListSuccess(siteItems));

            ctx.dispatch(new UpdateAuditSitesListFilterOptions(siteItems));
          }),
        ),
      ),
      catchError(() => ctx.dispatch(new LoadAuditSitesListFail())),
    );
  }

  @Action(LoadAuditSitesListSuccess)
  loadSitesListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditSiteItems: siteItems }: LoadAuditSitesListSuccess,
  ): void {
    ctx.patchState({
      sites: {
        error: '',
        list: siteItems,
        loading: false,
      },
    });
  }

  @Action(LoadAuditSitesListFail)
  loadSitesListFail(ctx: StateContext<any>) {
    ctx.patchState({
      sites: {
        list: [],
        loading: false,
        error: 'Failed to load audit sites data',
      },
    });
  }

  @Action(UpdateAuditSitesListFilterOptions)
  updateSitesListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditSiteItems: siteItems }: UpdateAuditSitesListFilterOptions,
  ): void {
    const siteItemsFilterOptions = {
      siteName: getFilterOptionsForColumn(siteItems, 'siteName'),
      siteAddress: getFilterOptionsForColumn(siteItems, 'siteAddress'),
      city: getFilterOptionsForColumn(siteItems, 'city'),
      country: getFilterOptionsForColumn(siteItems, 'country'),
      postcode: getFilterOptionsForColumn(siteItems, 'postcode'),
    };

    ctx.patchState({ siteItemsFilterOptions });
  }

  @Action(UpdateAuditSitesListGridConfig)
  updateSitesListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    {
      auditSiteItemsGridConfig: siteItemsGridConfig,
    }: UpdateAuditSitesListGridConfig,
  ): void {
    ctx.patchState({ siteItemsGridConfig });
  }

  // #endregion SitesList

  // #region AuditDocumentsList
  @Action(LoadAuditDocumentsList)
  loadAuditDocumentsList(ctx: StateContext<AuditDetailsStateModel>) {
    const currentState = ctx.getState();
    ctx.patchState({
      documents: {
        ...currentState.documents,
        loading: true,
        error: '',
      },
    });

    return this.routeStoreService.getPathParamByKey('auditId').pipe(
      switchMap((auditId) =>
        this.auditDocumentsListService
          .getAuditDocumentsList(auditId, false)
          .pipe(
            throwIfNotSuccess(),
            tap((sitesListDto) => {
              const hasAuditsEditPermission =
                this.profileStoreService.hasPermission(
                  PermissionCategories.Audits,
                  PermissionsList.Edit,
                )();

              const isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser();

              const auditDocumentsList =
                AuditDetailsMapperService.mapToAuditDocumentItemModel(
                  sitesListDto,
                  hasAuditsEditPermission,
                  isDnvUser,
                );

              ctx.dispatch(
                new LoadAuditDocumentsListSuccess(auditDocumentsList),
              );

              ctx.dispatch(
                new UpdateAuditDocumentsListFilterOptions(auditDocumentsList),
              );
            }),
            catchError(() => ctx.dispatch(new LoadAuditDocumentsListFail())),
          ),
      ),
    );
  }

  @Action(LoadAuditDocumentsListSuccess)
  loadAuditDocumentsListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDocumentsList }: LoadAuditDocumentsListSuccess,
  ): void {
    ctx.patchState({
      documents: {
        error: '',
        list: auditDocumentsList,
        loading: false,
      },
    });
  }

  @Action(LoadAuditDocumentsListFail)
  loadAuditDocumentsListFail(ctx: StateContext<any>) {
    ctx.patchState({
      documents: {
        list: [],
        error: 'Failed to load document data',
        loading: false,
      },
    });
  }

  @Action(UpdateAuditDocumentsListFilterOptions)
  updateAuditDocumentsListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDocumentsList }: UpdateAuditDocumentsListFilterOptions,
  ): void {
    const auditDocumentsFilterOptions = {
      fileType: getFilterOptionsForColumn(auditDocumentsList, 'fileType'),
      uploadedBy: getFilterOptionsForColumn(auditDocumentsList, 'uploadedBy'),
      fileName: getFilterOptionsForColumn(auditDocumentsList, 'fileName'),
    };

    ctx.patchState({ auditDocumentsFilterOptions });
  }

  @Action(UpdateAuditDocumentsListGridConfig)
  updateAuditDocumentsListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDocumentsGridConfig }: UpdateAuditDocumentsListGridConfig,
  ): void {
    ctx.patchState({ auditDocumentsGridConfig });
  }

  // #endregion AuditDocumentsList
}
