import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { catchError, tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import {
  buildStatusColorPalette,
  shouldApplyFilter,
} from '@customer-portal/shared/helpers/chart';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getDateMinusDays } from '@customer-portal/shared/helpers/date';
import {
  extractAppliedFilters,
  formatFilter,
  formatFilterOnlyDate,
} from '@customer-portal/shared/helpers/grid';
import { getCurrentYearMinus5Range } from '@customer-portal/shared/helpers/time';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
  DrillDownFilterColumnMapping,
  SharedSelectTreeChangeEventOutput,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';
import { CategoryStylesService } from '@customer-portal/shared/services/dynamicstyle';

import { FindingChartFilterKey } from '../constants';
import { FindingListItemEnrichedDto, FindingsTrendsGraphDto } from '../dtos';
import {
  FindingStatus,
  FindingTabs,
  FindingTrendsGraphModel,
  OpenFindingsMonthsPeriod,
} from '../models';
import {
  FindingGraphsMapperService,
  FindingGraphsService,
  FindingListGraphMapperService,
  FindingsListService,
} from '../services';
import {
  CreateFindingListByClauseDataGradient,
  CreateFindingListBySiteListGradient,
  CreateFindingListDataTrendsColumns,
  CreateFindingListDataTrendsGradient,
  LoadBecomingOverdueFindingListGraphData,
  LoadEarlyStageFindingListGraphData,
  LoadFindingListAndGraphFilters,
  LoadFindingListAndGraphFiltersFail,
  LoadFindingListByClauseList,
  LoadFindingListByClauseListFail,
  LoadFindingListByClauseListSuccess,
  LoadFindingListBySiteList,
  LoadFindingListBySiteListFail,
  LoadFindingListBySiteListSuccess,
  LoadFindingListByStatusGraphData,
  LoadFindingListByStatusGraphDataFail,
  LoadFindingListByStatusGraphDataSuccess,
  LoadFindingListDataTrends,
  LoadFindingListDataTrendsFail,
  LoadFindingListDataTrendsSuccess,
  LoadFindingListGraphData,
  LoadFindingListStatusByCategoryGraphData,
  LoadFindingListStatusByCategoryGraphDataFail,
  LoadFindingListStatusByCategoryGraphDataSuccess,
  LoadFindingListTrendsGraphData,
  LoadFindingListTrendsGraphDataFail,
  LoadFindingListTrendsGraphDataSuccess,
  LoadInProgressFindingListGraphData,
  LoadOpenFindingListGraphData,
  LoadOverdueFindingListGraphData,
  NavigateFromFindingListChartToListView,
  NavigateFromFindingListTreeTableToListView,
  ResetFindingListGraphFiltersExceptDateToCurrentYear,
  ResetFindingsListGraphState,
  SetActiveFindingListGraphTab,
  SetNavigationGridConfig,
  UpdateFindingListGraphFilterByKey,
  UpdateFindingListGraphFilterCompanies,
  UpdateFindingListGraphFilteredDateRange,
  UpdateFindingListGraphFilterServices,
  UpdateFindingListGraphFilterSites,
} from './actions';

export interface FindingsGraphStatus<T> {
  data: T;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export interface FindingListGraphStateModel {
  activeTab: FindingTabs;
  allFindingItems: FindingListItemEnrichedDto[];
  findingItems: FindingListItemEnrichedDto[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  originalFilterCompanies: number[];
  originalFilterServices: number[];
  originalFilterSites: number[];
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  filterCompanies: number[];
  filterServices: number[];
  filterSites: number[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataSites: CustomTreeNode[];
  findingsBySiteList: FindingsGraphStatus<TreeNode[]>;
  findingsBySiteListGradient: { [key: string]: Map<number, string> };
  findingsBySiteListColumns: TreeColumnDefinition[];
  findingTrends: {
    graphData: FindingsGraphStatus<FindingTrendsGraphModel>;
    data: FindingsGraphStatus<TreeNode[]>;
    columns: FindingsGraphStatus<TreeColumnDefinition[]>;
    gradient: FindingsGraphStatus<Map<number, string>>;
  };
  openFindings: {
    overdue: FindingsGraphStatus<BarChartModel>;
    becomingOverdue: FindingsGraphStatus<BarChartModel>;
    inProgress: FindingsGraphStatus<BarChartModel>;
    earlyStage: FindingsGraphStatus<BarChartModel>;
  };
  findingStatus: {
    byStatus: FindingsGraphStatus<DoughnutChartModel>;
    byCategory: FindingsGraphStatus<BarChartModel>;
  };
  findingsClause: {
    byClauseList: FindingsGraphStatus<TreeNode[]>;
    byClauseListGradient: { [key: string]: Map<number, string> };
    byClauseColumns: TreeColumnDefinition[];
  };
}

const defaultFindingsGraphStatus: FindingsGraphStatus<any> = {
  data: EMPTY_GRAPH_DATA,
  loaded: false,
  loading: false,
  error: null,
};

const defaultState: FindingListGraphStateModel = {
  activeTab: FindingTabs.FindingStatus,
  allFindingItems: [],
  findingItems: [],
  loading: false,
  loaded: false,
  error: null,
  originalFilterCompanies: [],
  originalFilterServices: [],
  originalFilterSites: [],
  filterStartDate: null,
  filterEndDate: null,
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  findingsBySiteListColumns: [],
  findingsBySiteList: { ...defaultFindingsGraphStatus },
  findingsBySiteListGradient: {},
  openFindings: {
    overdue: { ...defaultFindingsGraphStatus },
    becomingOverdue: { ...defaultFindingsGraphStatus },
    inProgress: { ...defaultFindingsGraphStatus },
    earlyStage: { ...defaultFindingsGraphStatus },
  },
  findingStatus: {
    byStatus: { ...defaultFindingsGraphStatus },
    byCategory: { ...defaultFindingsGraphStatus },
  },
  findingsClause: {
    byClauseList: { ...defaultFindingsGraphStatus },
    byClauseListGradient: {},
    byClauseColumns: [],
  },
  findingTrends: {
    graphData: {
      data: EMPTY_GRAPH_DATA,
      loaded: false,
      loading: false,
      error: null,
    },
    data: {
      data: [],
      loaded: false,
      loading: false,
      error: null,
    },
    columns: {
      data: [],
      loaded: false,
      loading: false,
      error: null,
    },
    gradient: {
      data: new Map<number, string>(),
      loaded: false,
      loading: false,
      error: null,
    },
  },
};

@State<FindingListGraphStateModel>({
  name: 'findingListGraph',
  defaults: defaultState,
})
@Injectable()
export class FindingListGraphState {
  constructor(
    private findingsService: FindingsListService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private categoryStylesService: CategoryStylesService,
    private readonly findingGraphsService: FindingGraphsService,
  ) {}

  @Action(SetActiveFindingListGraphTab)
  setActiveFindingListGraphTab(
    ctx: StateContext<FindingListGraphStateModel>,
    { activeTab }: SetActiveFindingListGraphTab,
  ) {
    ctx.patchState({ activeTab });
  }

  @Action(LoadFindingListAndGraphFilters)
  loadFindingListAndGraphFilters(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    this.resetLoadedFlags(ctx, true);
    const serviceMasterList =
      this.globalServiceMasterStoreService.serviceMasterList();
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();

    return this.findingsService.getFindingList().pipe(
      throwIfNotSuccess(),
      tap((findingListDto) => {
        const allFindingItems = findingListDto?.data || [];

        const dedupedFindingItems = allFindingItems.map((item) => {
          if (Array.isArray(item.services)) {
            return { ...item, services: Array.from(new Set(item.services)) };
          }

          return item;
        });
        const enrichedFindingItems =
          FindingListGraphMapperService.enrichFindingItems(
            dedupedFindingItems,
            siteMasterList,
            serviceMasterList,
          );

        const {
          findingItems: filtered,
          dataCompanies,
          dataServices,
          dataSites,
        } = FindingListGraphMapperService.recalculateState(
          enrichedFindingItems,
          [],
          [],
          [],
          null,
          null,
        );

        ctx.patchState({
          allFindingItems: enrichedFindingItems,
          dataCompanies,
          dataServices,
          dataSites,
          filterStartDate: null,
          filterEndDate: null,
          loaded: true,
          loading: false,
        });

        if (filtered.length === enrichedFindingItems.length) {
          ctx.patchState({
            findingItems: [],
          });
        } else {
          ctx.patchState({
            findingItems: filtered,
          });
        }

        ctx.dispatch(new LoadFindingListGraphData());
      }),
      catchError((err) =>
        ctx.dispatch(new LoadFindingListAndGraphFiltersFail(err)),
      ),
    );
  }

  @Action(LoadFindingListAndGraphFiltersFail)
  loadFindingListAndGraphFiltersFail(
    ctx: StateContext<any>,
    { error }: LoadFindingListAndGraphFiltersFail,
  ) {
    ctx.patchState({
      allFindingItems: [],
      error: error?.message || 'Failed to load finding list and graph filters',
      loading: false,
    });
  }

  @Action(UpdateFindingListGraphFilterByKey)
  updateFindingListGraphFilterByKey(
    ctx: StateContext<FindingListGraphStateModel>,
    { data, key }: UpdateFindingListGraphFilterByKey,
  ) {
    this.resetLoadedFlags(ctx, true);
    const actionsMap = {
      [FindingChartFilterKey.Companies]: [
        new UpdateFindingListGraphFilterCompanies(data as number[]),
      ],
      [FindingChartFilterKey.Services]: [
        new UpdateFindingListGraphFilterServices(data as number[]),
      ],
      [FindingChartFilterKey.Sites]: [
        new UpdateFindingListGraphFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
      [FindingChartFilterKey.TimeRange]: [
        new UpdateFindingListGraphFilteredDateRange(data as Date[]),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateFindingListGraphFilterCompanies)
  updateFindingListGraphFilterCompanies(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: UpdateFindingListGraphFilterCompanies,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterCompanies: data,
      originalFilterCompanies: data,
    });
    const servicesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      data,
      [],
      state.filterSites,
      state.filterStartDate,
      state.filterEndDate,
    );
    const { dataServices } = servicesFiltered;

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const sitesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      data,
      filterServices,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );
    const { dataSites } = sitesFiltered;

    state = this.patchAndGetState(ctx, {
      dataSites,
      dataServices,
    });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { findingItems } = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      data,
      filterServices,
      filterSites,
      state.filterStartDate,
      state.filterEndDate,
    );

    ctx.patchState({
      dataServices,
      dataSites,
      filterServices,
      filterSites,
    });

    if (findingItems.length === state.allFindingItems.length) {
      ctx.patchState({
        findingItems: [],
      });
    } else {
      ctx.patchState({
        findingItems,
      });
    }

    ctx.dispatch(new LoadFindingListGraphData());
  }

  @Action(UpdateFindingListGraphFilterServices)
  updateFindingListGraphFilterServices(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: UpdateFindingListGraphFilterServices,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterServices: data,
      originalFilterServices: data,
    });

    const companiesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      [],
      data,
      state.filterSites,
      state.filterStartDate,
      state.filterEndDate,
    );
    const { dataCompanies } = companiesFiltered;

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const sitesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      data,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );
    const { dataSites } = sitesFiltered;

    state = this.patchAndGetState(ctx, { dataCompanies, dataSites });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { findingItems } = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      data,
      filterSites,
      state.filterStartDate,
      state.filterEndDate,
    );

    ctx.patchState({
      dataCompanies,
      dataSites,
      filterCompanies,
      filterSites,
    });

    if (findingItems.length === state.allFindingItems.length) {
      ctx.patchState({
        findingItems: [],
      });
    } else {
      ctx.patchState({
        findingItems,
      });
    }

    ctx.dispatch(new LoadFindingListGraphData());
  }

  @Action(UpdateFindingListGraphFilterSites)
  updateFindingListGraphFilterSites(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: UpdateFindingListGraphFilterSites,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterSites: data.filter as number[],
      originalFilterSites: data.filter as number[],
    });

    const companiesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      [],
      state.filterServices,
      data.filter as number[],
      state.filterStartDate,
      state.filterEndDate,
    );
    const { dataCompanies } = companiesFiltered;

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const servicesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      [],
      data.filter as number[],
      state.filterStartDate,
      state.filterEndDate,
    );
    const { dataServices } = servicesFiltered;

    state = this.patchAndGetState(ctx, { dataCompanies, dataServices });

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const { dataSites } = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      filterServices,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );

    const { findingItems } = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      filterServices,
      data.filter as number[],
      state.filterStartDate,
      state.filterEndDate,
    );

    ctx.patchState({
      filterCompanies,
      filterServices,
      dataCompanies,
      dataServices,
      dataSites,
    });

    if (findingItems.length === state.allFindingItems.length) {
      ctx.patchState({
        findingItems: [],
      });
    } else {
      ctx.patchState({
        findingItems,
      });
    }

    ctx.dispatch(new LoadFindingListGraphData());
  }

  @Action(UpdateFindingListGraphFilteredDateRange)
  updateFindingListGraphFilteredDateRange(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: UpdateFindingListGraphFilteredDateRange,
  ) {
    let state = ctx.getState();
    let filterStartDate: Date | null = null;
    let filterEndDate: Date | null = null;

    if (Array.isArray(data) && data.length === 2) {
      filterStartDate = data[0] ?? null;
      filterEndDate = data[1] ?? null;
    }

    state = this.patchAndGetState(ctx, {
      filterStartDate,
      filterEndDate,
      filterCompanies: state.originalFilterCompanies,
      filterServices: state.originalFilterServices,
      filterSites: state.originalFilterSites,
    });

    const { findingItems: findingItemsForTheDate } =
      FindingListGraphMapperService.recalculateState(
        state.allFindingItems,
        state.filterCompanies,
        state.filterServices,
        state.filterSites,
        filterStartDate,
        filterEndDate,
      );

    if (findingItemsForTheDate.length === 0) {
      ctx.patchState({
        dataCompanies: [],
        dataServices: [],
        dataSites: [],
        filterCompanies: [],
        filterServices: [],
        filterSites: [],
        findingItems: [],
      });
      ctx.dispatch(new LoadFindingListGraphData());

      return;
    }

    const companiesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      [],
      state.filterServices,
      state.filterSites,
      filterStartDate,
      filterEndDate,
    );
    const { dataCompanies } = companiesFiltered;

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const servicesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      [],
      state.filterSites,
      filterStartDate,
      filterEndDate,
    );
    const { dataServices } = servicesFiltered;

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const sitesFiltered = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      filterServices,
      [],
      filterStartDate,
      filterEndDate,
    );
    const { dataSites } = sitesFiltered;

    state = this.patchAndGetState(ctx, {
      dataCompanies,
      dataServices,
      dataSites,
    });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { findingItems } = FindingListGraphMapperService.recalculateState(
      state.allFindingItems,
      filterCompanies,
      filterServices,
      filterSites,
      filterStartDate,
      filterEndDate,
    );

    ctx.patchState({
      dataCompanies,
      dataServices,
      dataSites,
      filterCompanies,
      filterServices,
      filterSites,
    });

    if (findingItems.length === state.allFindingItems.length) {
      ctx.patchState({
        findingItems: [],
      });
    } else {
      ctx.patchState({
        findingItems,
      });
    }

    ctx.dispatch(new LoadFindingListGraphData());
  }

  @Action(LoadFindingListGraphData)
  loadFindingListGraphData(ctx: StateContext<FindingListGraphStateModel>) {
    this.resetLoadedFlags(ctx, false);
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [FindingTabs.FindingStatus]: [
        new LoadFindingListByStatusGraphData(),
        new LoadFindingListStatusByCategoryGraphData(),
      ],
      [FindingTabs.OpenFindings]: [new LoadOpenFindingListGraphData()],
      [FindingTabs.Trends]: [
        new LoadFindingListTrendsGraphData(),
        new LoadFindingListDataTrends(),
      ],
      [FindingTabs.FindingsByClause]: [new LoadFindingListByClauseList()],
      [FindingTabs.FindingsBySite]: [new LoadFindingListBySiteList()],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  @Action(LoadFindingListByStatusGraphData)
  loadFindingListByStatusGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    ctx.patchState({
      findingStatus: {
        ...ctx.getState().findingStatus,
        byStatus: {
          ...ctx.getState().findingStatus.byStatus,
          loading: true,
          error: null,
        },
      },
    });

    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());

    const findingsByStatusGraphDto =
      FindingListGraphMapperService.generateFindingsByStatusGraphDto(
        findingItems,
      );
    const findingsByStatusGraphData =
      FindingGraphsMapperService.mapToFindingsByStatusGraphModel(
        findingsByStatusGraphDto,
      );

    ctx.dispatch(
      new LoadFindingListByStatusGraphDataSuccess(findingsByStatusGraphData),
    );
  }

  @Action(LoadFindingListByStatusGraphDataSuccess)
  loadFindingListByStatusGraphDataSuccess(
    ctx: StateContext<FindingListGraphStateModel>,
    { findingsByStatusGraphData }: LoadFindingListByStatusGraphDataSuccess,
  ) {
    ctx.patchState({
      findingStatus: {
        ...ctx.getState().findingStatus,
        byStatus: {
          data: findingsByStatusGraphData,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(LoadFindingListByStatusGraphDataFail)
  loadFindingListByStatusGraphDataFail(
    ctx: StateContext<FindingListGraphStateModel>,
    { error }: LoadFindingListByStatusGraphDataFail,
  ) {
    ctx.patchState({
      findingStatus: {
        ...ctx.getState().findingStatus,
        byStatus: {
          ...ctx.getState().findingStatus.byStatus,
          loaded: false,
          loading: false,
          error: error?.message || 'Error loading findings by status',
        },
      },
    });
  }

  @Action(LoadFindingListStatusByCategoryGraphData)
  loadFindingListStatusByCategoryGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    ctx.patchState({
      findingStatus: {
        ...ctx.getState().findingStatus,
        byCategory: {
          ...ctx.getState().findingStatus.byCategory,
          loading: true,
          error: null,
        },
      },
    });

    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());

    const findingByCategoryGraphDto =
      FindingListGraphMapperService.generateFindingStatusByCategoryGraphDto(
        findingItems,
      );

    const findingsByCategoryGraphData =
      FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(
        findingByCategoryGraphDto,
      );

    ctx.dispatch(
      new LoadFindingListStatusByCategoryGraphDataSuccess(
        findingsByCategoryGraphData,
      ),
    );
  }

  @Action(LoadFindingListStatusByCategoryGraphDataSuccess)
  loadFindingListStatusByCategoryGraphDataSuccess(
    ctx: StateContext<FindingListGraphStateModel>,
    {
      findingStatusByCategoryGraphData,
    }: LoadFindingListStatusByCategoryGraphDataSuccess,
  ) {
    ctx.patchState({
      findingStatus: {
        ...ctx.getState().findingStatus,
        byCategory: {
          data: findingStatusByCategoryGraphData,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(LoadFindingListStatusByCategoryGraphDataFail)
  loadFindingListStatusByCategoryGraphDataFail(
    ctx: StateContext<FindingListGraphStateModel>,
    { error }: LoadFindingListStatusByCategoryGraphDataFail,
  ) {
    ctx.patchState({
      findingStatus: {
        ...ctx.getState().findingStatus,
        byCategory: {
          data: EMPTY_GRAPH_DATA,
          loaded: false,
          loading: false,
          error: error?.message || 'Error loading findings by category',
        },
      },
    });
  }

  @Action(LoadFindingListTrendsGraphData)
  loadFindingListTrendsGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    const { filterCompanies, filterServices, filterSites } = ctx.getState();

    return this.findingGraphsService
      .getFindingsTrendsGraphData(filterCompanies, filterServices, filterSites)
      .pipe(
        throwIfNotSuccess(),
        tap((findingsByCategoryGraphDto: FindingsTrendsGraphDto) => {
          const findingsByCategoryGraphData =
            FindingGraphsMapperService.mapToFindingsTrendsGraphModel(
              findingsByCategoryGraphDto,
            );

          ctx.dispatch(
            new LoadFindingListTrendsGraphDataSuccess(
              findingsByCategoryGraphData,
            ),
          );
        }),
        catchError((err) =>
          ctx.dispatch(new LoadFindingListTrendsGraphDataFail(err)),
        ),
      );
  }

  @Action(LoadFindingListTrendsGraphDataSuccess)
  loadFindingListTrendsGraphDataSuccess(
    ctx: StateContext<FindingListGraphStateModel>,
    { findingsTrendsGraphData }: LoadFindingListTrendsGraphDataSuccess,
  ) {
    ctx.patchState({
      findingTrends: {
        ...ctx.getState().findingTrends,
        graphData: {
          data: findingsTrendsGraphData,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(LoadFindingListTrendsGraphDataFail)
  loadFindingListTrendsGraphDataFail(
    ctx: StateContext<FindingListGraphStateModel>,
    { error }: LoadFindingListTrendsGraphDataFail,
  ) {
    ctx.patchState({
      findingTrends: {
        ...ctx.getState().findingTrends,
        graphData: {
          data: EMPTY_GRAPH_DATA,
          loaded: false,
          loading: false,
          error: error?.message || 'Error loading findings trends',
        },
      },
    });
  }

  @Action(LoadFindingListDataTrends)
  loadFindingListDataTrends(ctx: StateContext<FindingListGraphStateModel>) {
    const { filterCompanies, filterServices, filterSites } = ctx.getState();

    return this.findingGraphsService
      .getFindingsTrendsData(filterCompanies, filterServices, filterSites)
      .pipe(
        throwIfNotSuccess(),
        tap((findingsTrendsData) => {
          const cleanedData = FindingListGraphMapperService.stripTypename(
            findingsTrendsData.data,
          );
          const columns = FindingGraphsMapperService.generateColumnsForTrends(
            cleanedData as TreeNode[],
          );
          const trendsGradient =
            FindingGraphsMapperService.generateGradientMapping(
              cleanedData as TreeNode[],
            );

          ctx.dispatch(new LoadFindingListDataTrendsSuccess(cleanedData));
          ctx.dispatch(new CreateFindingListDataTrendsColumns(columns));
          ctx.dispatch(new CreateFindingListDataTrendsGradient(trendsGradient));
        }),
        catchError((err) =>
          ctx.dispatch(new LoadFindingListDataTrendsFail(err)),
        ),
      );
  }

  @Action(LoadFindingListDataTrendsSuccess)
  loadFindingListDataTrendsSuccess(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: LoadFindingListDataTrendsSuccess,
  ) {
    ctx.patchState({
      findingTrends: {
        ...ctx.getState().findingTrends,
        data: { data, loaded: true, loading: false, error: null },
      },
    });
  }

  @Action(LoadFindingListDataTrendsFail)
  loadFindingListDataTrendsFail(
    ctx: StateContext<FindingListGraphStateModel>,
    { error }: LoadFindingListDataTrendsFail,
  ) {
    ctx.patchState({
      findingTrends: {
        ...ctx.getState().findingTrends,
        data: {
          data: [],
          loaded: false,
          loading: false,
          error: error?.message || 'Error loading findings data trends',
        },
      },
    });
  }

  @Action(CreateFindingListDataTrendsColumns)
  createFindingListDataTrendsColumns(
    ctx: StateContext<FindingListGraphStateModel>,
    { columns }: CreateFindingListDataTrendsColumns,
  ) {
    ctx.patchState({
      findingTrends: {
        ...ctx.getState().findingTrends,
        columns: { data: columns, loaded: true, loading: false, error: null },
      },
    });
  }

  @Action(CreateFindingListDataTrendsGradient)
  createFindingListDataTrendsGradient(
    ctx: StateContext<FindingListGraphStateModel>,
    { trendsGradient }: CreateFindingListDataTrendsGradient,
  ) {
    ctx.patchState({
      findingTrends: {
        ...ctx.getState().findingTrends,
        gradient: {
          data: trendsGradient,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(LoadFindingListByClauseList)
  loadFindingListByClauseList(ctx: StateContext<FindingListGraphStateModel>) {
    ctx.patchState({
      findingsClause: {
        ...ctx.getState().findingsClause,
        byClauseList: {
          ...ctx.getState().findingsClause.byClauseList,
          loading: true,
          error: null,
        },
      },
    });

    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.findingGraphsService
      .getFindingsByClauseList(
        filterStartDate!,
        filterEndDate!,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        throwIfNotSuccess(),
        tap((findingsByClauseListDto) => {
          ctx.dispatch(
            new LoadFindingListByClauseListSuccess(
              findingsByClauseListDto.data,
            ),
          );
        }),
        catchError((err) =>
          ctx.dispatch(new LoadFindingListByClauseListFail(err)),
        ),
      );
  }

  @Action(LoadFindingListByClauseListSuccess)
  loadFindingListByClauseListSuccess(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: LoadFindingListByClauseListSuccess,
  ) {
    ctx.patchState({
      findingsClause: {
        ...ctx.getState().findingsClause,
        byClauseList: {
          data,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });

    const allCategories = new Set<string>();
    data.forEach((service) => {
      (service.data.categoryCounts || []).forEach((cat: any) =>
        allCategories.add(cat.key),
      );
      (service.children || []).forEach((clause) => {
        (clause.data.categoryCounts || []).forEach((cat: any) =>
          allCategories.add(cat.key),
        );
        (clause.children || []).forEach((item) => {
          (item.data.categoryCounts || []).forEach((cat: any) =>
            allCategories.add(cat.key),
          );
        });
      });
    });
    const allCategoriesArr = Array.from(allCategories);

    const processed = data.map((node: any) =>
      FindingListGraphMapperService.flattenCategoriesClauseCategoryNode(
        node,
        allCategoriesArr,
      ),
    );

    const clauseColumns: TreeColumnDefinition[] = [
      {
        field: 'name',
        header: 'serviceChapterClause',
        isTranslatable: true,
        width: '240px',
      },
      ...allCategoriesArr.map((cat) => ({
        field: cat,
        header: cat,
        isTranslatable: false,
        width: '129px',
      })),
      {
        field: 'totalCount',
        header: 'total',
        isTranslatable: true,
        width: '129px',
      },
    ];

    const FINDINGS_CATEGORY_TRENDS_COLOR_MAPPING: Record<string, string> = {
      Observation: '#AEE9FF',
      'CAT2 (Minor)': '#fffde4',
      'CAT1 (Major)': '#fde8e9',
      'Opportunity for Improvement': '#FBB482',
      'Noteworthy Effort': '#3F9C35',
    };

    const palette = buildStatusColorPalette(
      allCategoriesArr,
      FINDINGS_CATEGORY_TRENDS_COLOR_MAPPING,
    );

    const gradient: { [key: string]: string } = {};
    allCategoriesArr.forEach((category, idx) => {
      const color = palette[idx];
      gradient[category] = color;
    });

    const result: { [key: string]: Map<number, string> } = {};
    Object.entries(gradient).forEach(([cat, color]) => {
      const map = new Map<number, string>();
      map.set(-1, color as string);
      result[cat] = map;
    });

    this.categoryStylesService.setGradientStyles(
      'findings-by-clause',
      gradient,
    );

    ctx.patchState({
      findingsClause: {
        ...ctx.getState().findingsClause,
        byClauseList: {
          data: processed,
          loaded: true,
          loading: false,
          error: null,
        },
        byClauseListGradient: result,
        byClauseColumns: clauseColumns,
      },
    });
  }

  @Action(LoadFindingListByClauseListFail)
  loadFindingListByClauseListFail(
    ctx: StateContext<FindingListGraphStateModel>,
    { error }: LoadFindingListByClauseListFail,
  ) {
    ctx.patchState({
      findingsClause: {
        ...ctx.getState().findingsClause,
        byClauseList: {
          data: [],
          loaded: false,
          loading: false,
          error: error?.message || 'Error loading findings by clause list',
        },
      },
    });
  }

  @Action(CreateFindingListByClauseDataGradient)
  createFindingListByClauseDataGradient(
    ctx: StateContext<FindingListGraphStateModel>,
    { gradient }: CreateFindingListByClauseDataGradient,
  ) {
    ctx.patchState({
      findingsClause: {
        ...ctx.getState().findingsClause,
        byClauseListGradient: gradient,
      },
    });
  }

  @Action(LoadFindingListBySiteList)
  loadFindingsBySiteList(ctx: StateContext<FindingListGraphStateModel>) {
    ctx.patchState({
      findingsBySiteList: {
        ...ctx.getState().findingsBySiteList,
        loading: true,
        error: null,
      },
    });

    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());
    const { filterSites } = ctx.getState();

    const findingsBySiteListDto =
      FindingListGraphMapperService.generateFindingsSiteResponse(
        findingItems,
        filterSites,
      );

    ctx.dispatch(
      new LoadFindingListBySiteListSuccess(findingsBySiteListDto.data),
    );
  }

  @Action(LoadFindingListBySiteListSuccess)
  loadFindingListBySiteListSuccess(
    ctx: StateContext<FindingListGraphStateModel>,
    { data }: LoadFindingListBySiteListSuccess,
  ) {
    const processed = data.map((node: any) =>
      FindingListGraphMapperService.flattenCategoriesNode(node),
    );
    const allCategories = new Set<string>();
    data.forEach((country) => {
      (country.data.categories || []).forEach((cat: any) =>
        allCategories.add(cat.category),
      );
      (country.children || []).forEach((city) => {
        (city.data.categories || []).forEach((cat: any) =>
          allCategories.add(cat.category),
        );
        (city.children || []).forEach((site) => {
          (site.data.categories || []).forEach((cat: any) =>
            allCategories.add(cat.category),
          );
        });
      });
    });
    const allCategoriesArr = Array.from(allCategories);

    const siteColumns: TreeColumnDefinition[] = [
      {
        field: 'name',
        header: 'country',
        isTranslatable: true,
        width: '240px',
      },
      ...allCategoriesArr.map((cat) => ({
        field: cat,
        header: cat,
        isTranslatable: false,
        width: '129px',
      })),
      {
        field: 'totalCount',
        header: 'total',
        isTranslatable: true,
        width: '129px',
      },
    ];

    ctx.patchState({
      findingsBySiteList: {
        data: processed,
        loaded: true,
        loading: false,
        error: null,
      },
      findingsBySiteListColumns: siteColumns,
    });

    const FINDINGS_CATEGORY_TRENDS_COLOR_MAPPING: Record<string, string> = {
      Observation: '#AEE9FF',
      'CAT2 (Minor)': '#fffde4',
      'CAT1 (Major)': '#fde8e9',
      'Opportunity for Improvement': '#FBB482',
      'Noteworthy Effort': '#3F9C35',
    };

    const palette = buildStatusColorPalette(
      allCategoriesArr,
      FINDINGS_CATEGORY_TRENDS_COLOR_MAPPING,
    );

    const gradient: { [key: string]: string } = {};
    allCategoriesArr.forEach((category, idx) => {
      const color = palette[idx];
      gradient[category] = color;
    });

    const result: { [key: string]: Map<number, string> } = {};
    Object.entries(gradient).forEach(([cat, color]) => {
      const map = new Map<number, string>();
      map.set(-1, color as string);
      result[cat] = map;
    });
    this.categoryStylesService.setGradientStyles('findings-by-site', gradient);
    ctx.dispatch(new CreateFindingListBySiteListGradient(result));
  }

  @Action(LoadFindingListBySiteListFail)
  loadFindingListBySiteListFail(
    ctx: StateContext<FindingListGraphStateModel>,
    { error }: LoadFindingListBySiteListFail,
  ) {
    ctx.patchState({
      findingsBySiteList: {
        data: [],
        loaded: false,
        loading: false,
        error: error?.message || 'Error loading findings by site list',
      },
    });
  }

  @Action(CreateFindingListBySiteListGradient)
  createFindingListBySiteListGradient(
    ctx: StateContext<FindingListGraphStateModel>,
    { gradient }: CreateFindingListBySiteListGradient,
  ) {
    ctx.patchState({ findingsBySiteListGradient: gradient });
  }

  @Action(LoadOpenFindingListGraphData)
  loadOpenFindingListGraphData(ctx: StateContext<FindingListGraphStateModel>) {
    ctx.dispatch(new LoadOverdueFindingListGraphData());
    ctx.dispatch(new LoadBecomingOverdueFindingListGraphData());
    ctx.dispatch(new LoadInProgressFindingListGraphData());
    ctx.dispatch(new LoadEarlyStageFindingListGraphData());
  }

  @Action(LoadOverdueFindingListGraphData)
  loadOverdueFindingListGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        overdue: {
          ...ctx.getState().openFindings.overdue,
          loading: true,
          error: null,
        },
      },
    });
    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());

    const { filterServices } = ctx.getState();

    const openFindingsGraphDto =
      FindingListGraphMapperService.generateOpenFindingsGraphDtoForOverdueByDate(
        findingItems,
        OpenFindingsMonthsPeriod.Overdue,
        filterServices,
      );

    const openFindingsGraphData =
      FindingGraphsMapperService.mapToOpenFindingsGraphModel(
        openFindingsGraphDto,
      );

    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        overdue: {
          data: openFindingsGraphData,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(LoadBecomingOverdueFindingListGraphData)
  loadBecomingOverdueFindingListGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        becomingOverdue: {
          ...ctx.getState().openFindings.becomingOverdue,
          loading: true,
          error: null,
        },
      },
    });

    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());

    const { filterServices } = ctx.getState();

    const openFindingsGraphDto =
      FindingListGraphMapperService.generateOpenFindingsGraphDtoForOverdueByDate(
        findingItems,
        OpenFindingsMonthsPeriod.BecomingOverdue,
        filterServices,
      );

    const openFindingsGraphData =
      FindingGraphsMapperService.mapToOpenFindingsGraphModel(
        openFindingsGraphDto,
      );

    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        becomingOverdue: {
          ...ctx.getState().openFindings.becomingOverdue,
          data: openFindingsGraphData,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(LoadInProgressFindingListGraphData)
  loadInProgressFindingListGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        inProgress: {
          ...ctx.getState().openFindings.inProgress,
          loading: true,
          error: null,
        },
      },
    });

    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());

    const { filterServices } = ctx.getState();

    const openFindingsGraphDto =
      FindingListGraphMapperService.generateOpenFindingsGraphDtoForOverdueByDate(
        findingItems,
        OpenFindingsMonthsPeriod.InProgress,
        filterServices,
      );

    const openFindingsGraphData =
      FindingGraphsMapperService.mapToOpenFindingsGraphModel(
        openFindingsGraphDto,
      );

    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        inProgress: {
          ...ctx.getState().openFindings.inProgress,
          data: openFindingsGraphData,
          loading: false,
          loaded: true,
          error: null,
        },
      },
    });
  }

  @Action(LoadEarlyStageFindingListGraphData)
  loadEarlyStageFindingListGraphData(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,
        earlyStage: {
          ...ctx.getState().openFindings.earlyStage,
          loading: true,
          error: null,
        },
      },
    });
    const findingItems = this.getFindingItemsForFindingsGraph(ctx.getState());

    const { filterServices } = ctx.getState();

    const openFindingsGraphDto =
      FindingListGraphMapperService.generateOpenFindingsGraphDtoForOverdueByDate(
        findingItems,
        OpenFindingsMonthsPeriod.EarlyStage,
        filterServices,
      );

    const openFindingsGraphData =
      FindingGraphsMapperService.mapToOpenFindingsGraphModel(
        openFindingsGraphDto,
      );

    ctx.patchState({
      openFindings: {
        ...ctx.getState().openFindings,

        earlyStage: {
          ...ctx.getState().openFindings.earlyStage,
          data: openFindingsGraphData,
          loaded: true,
          loading: false,
          error: null,
        },
      },
    });
  }

  @Action(ResetFindingListGraphFiltersExceptDateToCurrentYear)
  resetFindingListGraphFiltersExceptDateToCurrentYear(
    ctx: StateContext<FindingListGraphStateModel>,
  ) {
    const { startOfYear, endOfYear } = getCurrentYearMinus5Range();
    const { activeTab } = ctx.getState();

    if (activeTab === FindingTabs.Trends) {
      this.resetAllFiltersExceptDate(ctx, startOfYear, endOfYear);
    } else {
      this.resetAllFiltersExceptDate(ctx, null, null);
    }
  }

  @Action(ResetFindingsListGraphState)
  resetFindingsListGraphState(ctx: StateContext<FindingListGraphStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(NavigateFromFindingListChartToListView)
  navigateFromFindingListChartToListView(
    ctx: StateContext<FindingListGraphStateModel>,
    { tooltipFilters }: NavigateFromFindingListChartToListView,
  ) {
    const state = ctx.getState();
    const {
      activeTab,
      filterStartDate,
      filterEndDate,
      dataServices,
      filterServices,
      dataCompanies,
      filterCompanies,
      filterSites,
      findingItems,
    } = state;

    const filterColumnMappings: DrillDownFilterColumnMapping = {
      date: 'openDate',
      services: 'services',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
      status: 'status',
    };

    const daysOffset = 90;
    const dateFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.date,
    )
      ? filterStartDate &&
        filterEndDate &&
        formatFilterOnlyDate(
          [
            filterStartDate,
            activeTab === FindingTabs.OpenFindings
              ? getDateMinusDays(daysOffset)
              : filterEndDate,
          ],
          filterColumnMappings.date,
        )
      : [];

    const serviceFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.services,
    )
      ? extractAppliedFilters(
          dataServices,
          filterServices,
          filterColumnMappings.services,
        )
      : [];

    const companyFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.companyName,
    )
      ? extractAppliedFilters(
          dataCompanies,
          filterCompanies,
          filterColumnMappings.companyName,
        )
      : [];

    const allSiteDetails =
      filterSites && filterSites.length > 0
        ? findingItems
            .flatMap((a) => a.siteDetails || [])
            .filter((s) => filterSites.includes(s.id))
        : [];

    const uniqueCities = Array.from(
      new Set(allSiteDetails.map((s) => s.city).filter(Boolean)),
    );
    const uniqueSites = Array.from(
      new Set(allSiteDetails.map((s) => s.siteName).filter(Boolean)),
    );

    const citiesFilters = formatFilter(
      uniqueCities,
      filterColumnMappings.cities,
    );

    const siteFilters = formatFilter(uniqueSites, filterColumnMappings.sites);

    let updatedFilters = [
      ...tooltipFilters,
      ...serviceFilters,
      ...citiesFilters,
      ...siteFilters,
      ...companyFilters,
    ];

    if (dateFilters && dateFilters?.length > 0) {
      updatedFilters = [...updatedFilters, ...dateFilters];
    }

    if (activeTab === FindingTabs.OpenFindings) {
      const findingItemsFiltered =
        this.getFindingItemsForOpenFindingsGraphForNavigation(
          ctx.getState(),
          tooltipFilters,
        );
      const statusValues = Array.from(
        new Set(findingItemsFiltered.map((f) => f.status)),
      );

      const statusFilters = formatFilter(
        statusValues,
        filterColumnMappings.status!,
      );

      updatedFilters = [...updatedFilters, ...statusFilters];
    }
    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/findings']));
  }

  @Action(NavigateFromFindingListTreeTableToListView)
  navigateFromFindingListTreeTableToListView(
    ctx: StateContext<FindingListGraphStateModel>,
    { selectionValues }: NavigateFromFindingListTreeTableToListView,
  ) {
    const state = ctx.getState();
    const {
      filterStartDate,
      filterEndDate,
      dataCompanies,
      filterCompanies,
      dataServices,
      filterServices,
      filterSites,
      findingItems,
    } = state;

    const filterColumnMappings: Partial<DrillDownFilterColumnMapping> = {
      date: 'openDate',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
      services: 'services',
    };

    const dateFilters = shouldApplyFilter(
      selectionValues,
      filterColumnMappings.date!,
    )
      ? filterStartDate &&
        filterEndDate &&
        formatFilterOnlyDate(
          [filterStartDate, filterEndDate],
          filterColumnMappings.date!,
        )
      : [];

    const serviceFilters = shouldApplyFilter(
      selectionValues,
      filterColumnMappings.services!,
    )
      ? extractAppliedFilters(
          dataServices,
          filterServices,
          filterColumnMappings.services!,
        )
      : [];

    const companyFilters = shouldApplyFilter(
      selectionValues,
      filterColumnMappings.companyName!,
    )
      ? extractAppliedFilters(
          dataCompanies,
          filterCompanies,
          filterColumnMappings.companyName!,
        )
      : [];

    const allSiteDetails =
      filterSites && filterSites.length > 0
        ? findingItems
            .flatMap((a) => a.siteDetails || [])
            .filter((s) => filterSites.includes(s.id))
        : [];

    const uniqueCities = Array.from(
      new Set(allSiteDetails.map((s) => s.city).filter(Boolean)),
    );
    const uniqueSites = Array.from(
      new Set(allSiteDetails.map((s) => s.siteName).filter(Boolean)),
    );

    const citiesFilters = formatFilter(
      uniqueCities,
      filterColumnMappings.cities!,
    );

    const siteFilters = formatFilter(uniqueSites, filterColumnMappings.sites!);

    let updatedFilters = [
      ...selectionValues,
      ...citiesFilters,
      ...siteFilters,
      ...companyFilters,
      ...serviceFilters,
    ];

    if (dateFilters && dateFilters?.length > 0) {
      updatedFilters = [...updatedFilters, ...dateFilters];
    }

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/findings']));
  }

  private resetLoadedFlags(
    ctx: StateContext<FindingListGraphStateModel>,
    loaded: boolean,
  ): void {
    ctx.patchState({
      openFindings: {
        overdue: { ...ctx.getState().openFindings.overdue, loaded },
        becomingOverdue: {
          ...ctx.getState().openFindings.becomingOverdue,
          loaded,
        },
        inProgress: { ...ctx.getState().openFindings.inProgress, loaded },
        earlyStage: { ...ctx.getState().openFindings.earlyStage, loaded },
      },
      findingStatus: {
        byStatus: { ...ctx.getState().findingStatus.byStatus, loaded },
        byCategory: { ...ctx.getState().findingStatus.byCategory, loaded },
      },
      findingsClause: {
        byClauseList: { ...ctx.getState().findingsClause.byClauseList, loaded },
        byClauseListGradient: {
          ...ctx.getState().findingsClause.byClauseListGradient,
        },
        byClauseColumns: [...ctx.getState().findingsClause.byClauseColumns],
      },
      findingsBySiteList: {
        ...ctx.getState().findingsBySiteList,
        loaded,
      },
      findingTrends: {
        ...ctx.getState().findingTrends,
        graphData: {
          ...ctx.getState().findingTrends.graphData,
          loaded,
        },
        data: {
          ...ctx.getState().findingTrends.data,
          loaded,
        },
        columns: {
          ...ctx.getState().findingTrends.columns,
          loaded,
        },
        gradient: {
          ...ctx.getState().findingTrends.gradient,
          loaded,
        },
      },
    });
  }

  private prune<T>(data: { value: T }[], originalFilter: T[] = []): T[] {
    const available = data.map((d) => d.value);
    const filtered = (originalFilter || []).filter((f) =>
      available.includes(f),
    );

    return filtered;
  }

  private patchAndGetState(
    ctx: StateContext<FindingListGraphStateModel>,
    patch: Partial<FindingListGraphStateModel>,
  ): FindingListGraphStateModel {
    ctx.patchState(patch);

    return ctx.getState();
  }

  private flattenTree(nodes: CustomTreeNode[]): CustomTreeNode[] {
    let all: CustomTreeNode[] = [];
    nodes.forEach((node) => {
      all.push(node);

      if (node.children && node.children.length > 0) {
        all = all.concat(this.flattenTree(node.children));
      }
    });

    return all;
  }

  private pruneSiteFilter(
    dataSites: CustomTreeNode[],
    filterSites: number[],
  ): number[] {
    const availableSiteIds = this.flattenTree(dataSites).map((s) => s.data);
    const filtered = (filterSites || []).filter((id) =>
      availableSiteIds.includes(id),
    );

    return filtered;
  }

  private resetAllFiltersExceptDate(
    ctx: StateContext<FindingListGraphStateModel>,
    filterStartDate: Date | null,
    filterEndDate: Date | null,
  ) {
    const state = ctx.getState();
    const { findingItems, dataCompanies, dataServices, dataSites } =
      FindingListGraphMapperService.recalculateState(
        state.allFindingItems,
        [],
        [],
        [],
        filterStartDate,
        filterEndDate,
      );

    ctx.patchState({
      filterStartDate,
      filterEndDate,
      filterCompanies: [],
      filterServices: [],
      filterSites: [],
      originalFilterCompanies: [],
      originalFilterServices: [],
      originalFilterSites: [],
      dataCompanies,
      dataServices,
      dataSites,
    });

    if (filterStartDate === null && filterEndDate === null) {
      ctx.patchState({
        findingItems: [],
      });
    } else {
      ctx.patchState({
        findingItems,
      });
    }
  }

  private getFindingItemsForFindingsGraph(
    state: FindingListGraphStateModel,
  ): FindingListItemEnrichedDto[] {
    const {
      findingItems,
      allFindingItems,
      filterCompanies,
      filterServices,
      filterSites,
      filterStartDate,
      filterEndDate,
    } = state;

    const areAllFiltersEmpty =
      (!filterCompanies || filterCompanies.length === 0) &&
      (!filterServices || filterServices.length === 0) &&
      (!filterSites || filterSites.length === 0) &&
      filterStartDate === null &&
      filterEndDate === null;

    return areAllFiltersEmpty ? allFindingItems : findingItems;
  }

  private getFindingItemsForOpenFindingsGraphForNavigation(
    state: FindingListGraphStateModel,
    tooltipFilters: any[],
  ): FindingListItemEnrichedDto[] {
    const {
      findingItems,
      allFindingItems,
      filterCompanies,
      filterServices,
      filterSites,
    } = state;

    const areAllFiltersEmpty =
      (!filterCompanies || filterCompanies.length === 0) &&
      (!filterServices || filterServices.length === 0) &&
      (!filterSites || filterSites.length === 0);

    if (areAllFiltersEmpty) {
      return this.filterOpenFindingsByTooltip(allFindingItems, tooltipFilters);
    }

    return this.filterOpenFindingsByTooltip(findingItems, tooltipFilters);
  }

  private filterOpenFindingsByTooltip(
    findings: FindingListItemEnrichedDto[],
    tooltipFilters: any[],
  ): FindingListItemEnrichedDto[] {
    let filtered = findings;

    const allowedStatuses =
      FindingListGraphMapperService.getStatusesForOpenFindingsGraph();
    filtered = filtered.filter((f) =>
      allowedStatuses.includes(f.status as FindingStatus),
    );

    const servicesFilter = tooltipFilters.find((f) => f.label === 'services');

    if (
      servicesFilter &&
      servicesFilter.value &&
      servicesFilter.value.length > 0
    ) {
      const serviceValues = servicesFilter.value.map((v: any) => v.value);
      filtered = filtered.filter((f) =>
        (f.serviceDetails || []).some((s) =>
          serviceValues.includes(s.serviceName),
        ),
      );
    }

    const categoryFilter = tooltipFilters.find((f) => f.label === 'category');

    if (
      categoryFilter &&
      categoryFilter.value &&
      categoryFilter.value.length > 0
    ) {
      const categoryValues = categoryFilter.value.map((v: any) => v.value);
      filtered = filtered.filter((f) => categoryValues.includes(f.category));
    }

    const openDateFilter = tooltipFilters.find((f) => f.label === 'openDate');

    if (
      openDateFilter &&
      openDateFilter.value &&
      openDateFilter.value.length === 2
    ) {
      const [startDate, endDate] = openDateFilter.value.map((v: any) =>
        FindingListGraphMapperService.parseTooltipDate(v.value),
      );
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((f) => {
        const openDate = new Date(f.openDate);
        openDate.setHours(0, 0, 0, 0);

        return openDate >= startDate && openDate <= endDate;
      });
    }

    return filtered;
  }
}
