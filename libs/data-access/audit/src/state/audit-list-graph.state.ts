import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import { shouldApplyFilter } from '@customer-portal/shared/helpers/chart';
import {
  extractAppliedFilters,
  formatFilter,
  formatFilterOnlyDate,
} from '@customer-portal/shared/helpers/grid';
import { getCurrentYearRange } from '@customer-portal/shared/helpers/time';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
  DrillDownFilterColumnMapping,
  FilterValue,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { AuditChartFilterKey, AuditChartsTabs } from '../constants';
import { AuditListItemEnrichedDto } from '../dtos';
import { AuditDaysGridModel } from '../models';
import {
  AuditDaysGridService,
  AuditGraphsMapperService,
  AuditGraphsService,
  AuditListGraphMapperService,
  AuditListService,
} from '../services';
import { AuditDaysGridMapperService } from '../services/mappers/audit-days-grid-mapper.service';
import {
  LoadAuditListDaysBarGraphData,
  LoadAuditListDaysBarGraphDataSuccess,
  LoadAuditListDaysDoughnutGraphData,
  LoadAuditListDaysDoughnutGraphDataSuccess,
  LoadAuditListDaysGridData,
  LoadAuditListDaysGridDataSuccess,
  LoadAuditListGraphsData,
  NavigateFromAuditListChartToListView,
  NavigateFromAuditListChartTreeToListView,
  ResetAuditsListGraphState,
  SetActiveAuditsListGraphTab,
} from './actions/audit-list-graph.actions';
import {
  LoadAuditListAndGraphFilters,
  ResetAuditListGraphFiltersExceptDateToCurrentYear,
  SetNavigationGridConfig,
  UpdateAuditListGraphData,
  UpdateAuditListGraphFilterByKey,
  UpdateAuditListGraphFilterCompanies,
  UpdateAuditListGraphFilteredDateRange,
  UpdateAuditListGraphFilterServices,
  UpdateAuditListGraphFilterSites,
} from './actions';

export interface AuditListGraphStateModel {
  activeTab: AuditChartsTabs;
  allAuditItems: AuditListItemEnrichedDto[];
  auditItems: AuditListItemEnrichedDto[];
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
  auditStatusDoughnutGraphData: DoughnutChartModel;
  auditStatusBarGraphData: BarChartModel;
  auditDaysDoughnutGraphData: DoughnutChartModel;
  auditDaysBarGraphData: BarChartModel;
  auditDaysGridData: AuditDaysGridModel[];
}

const defaultState: AuditListGraphStateModel = {
  activeTab: AuditChartsTabs.AuditStatus,
  allAuditItems: [],
  auditItems: [],
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
  auditStatusDoughnutGraphData: EMPTY_GRAPH_DATA,
  auditStatusBarGraphData: EMPTY_GRAPH_DATA,
  auditDaysDoughnutGraphData: EMPTY_GRAPH_DATA,
  auditDaysBarGraphData: EMPTY_GRAPH_DATA,
  auditDaysGridData: [],
};

@State<AuditListGraphStateModel>({
  name: 'auditListGraph',
  defaults: defaultState,
})
@Injectable()
export class AuditListGraphState {
  constructor(
    private auditService: AuditListService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
    private readonly auditGraphsService: AuditGraphsService,
    private readonly auditDaysGridService: AuditDaysGridService,
  ) {}

  @Action(SetActiveAuditsListGraphTab)
  setActiveAuditsListGraphTab(
    ctx: StateContext<AuditListGraphStateModel>,
    { activeTab }: SetActiveAuditsListGraphTab,
  ) {
    ctx.patchState({ activeTab });
  }

  @Action(LoadAuditListAndGraphFilters)
  loadAuditListAndGraphFilters(ctx: StateContext<AuditListGraphStateModel>) {
    const serviceMasterList =
      this.globalServiceMasterStoreService.serviceMasterList();
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();

    return this.auditService.getAuditList().pipe(
      tap((auditListDto) => {
        const allAuditItems = auditListDto?.data || [];

        const enrichedAuditItems = AuditListGraphMapperService.enrichAuditItems(
          allAuditItems,
          siteMasterList,
          serviceMasterList,
        );

        const {
          auditItems: filtered,
          dataCompanies,
          dataServices,
          dataSites,
        } = AuditListGraphMapperService.recalculateState(
          enrichedAuditItems,
          [],
          [],
          [],
          null,
          null,
        );

        ctx.patchState({
          allAuditItems: enrichedAuditItems,
          auditItems: filtered,
          dataCompanies,
          dataServices,
          dataSites,
          filterStartDate: null,
          filterEndDate: null,
        });

        ctx.dispatch(new LoadAuditListGraphsData());
      }),
    );
  }

  @Action(UpdateAuditListGraphFilterByKey)
  updateAuditListGraphFilterByKey(
    ctx: StateContext<AuditListGraphStateModel>,
    { data, key }: UpdateAuditListGraphFilterByKey,
  ) {
    const actionsMap = {
      [AuditChartFilterKey.Companies]: [
        new UpdateAuditListGraphFilterCompanies(data as number[]),
      ],
      [AuditChartFilterKey.Services]: [
        new UpdateAuditListGraphFilterServices(data as number[]),
      ],
      [AuditChartFilterKey.Sites]: [
        new UpdateAuditListGraphFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
      [AuditChartFilterKey.TimeRange]: [
        new UpdateAuditListGraphFilteredDateRange(data as Date[]),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateAuditListGraphFilterCompanies)
  updateAuditListGraphFilterCompanies(
    ctx: StateContext<AuditListGraphStateModel>,
    { data }: UpdateAuditListGraphFilterCompanies,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterCompanies: data,
      originalFilterCompanies: data,
    });
    const { dataServices } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      data,
      [],
      state.filterSites,
      state.filterStartDate,
      state.filterEndDate,
    );

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const { dataSites } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      data,
      filterServices,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );

    state = this.patchAndGetState(ctx, {
      dataSites,
      dataServices,
    });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { auditItems } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
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
      auditItems,
    });

    ctx.dispatch(new LoadAuditListGraphsData());
  }

  @Action(UpdateAuditListGraphFilterServices)
  updateAuditListGraphFilterServices(
    ctx: StateContext<AuditListGraphStateModel>,
    { data }: UpdateAuditListGraphFilterServices,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterServices: data,
      originalFilterServices: data,
    });

    const { dataCompanies } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      [],
      data,
      state.filterSites,
      state.filterStartDate,
      state.filterEndDate,
    );

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const { dataSites } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      filterCompanies,
      data,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );

    state = this.patchAndGetState(ctx, { dataCompanies, dataSites });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { auditItems } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
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
      auditItems,
    });

    ctx.dispatch(new LoadAuditListGraphsData());
  }

  @Action(UpdateAuditListGraphFilterSites)
  updateAuditListGraphFilterSites(
    ctx: StateContext<AuditListGraphStateModel>,
    { data }: UpdateAuditListGraphFilterSites,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterSites: data.filter as number[],
      originalFilterSites: data.filter as number[],
    });

    const { dataCompanies } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      [],
      state.filterServices,
      data.filter as number[],
      state.filterStartDate,
      state.filterEndDate,
    );

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const { dataServices } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      filterCompanies,
      [],
      data.filter as number[],
      state.filterStartDate,
      state.filterEndDate,
    );

    state = this.patchAndGetState(ctx, { dataCompanies, dataServices });

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const { dataSites } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      filterCompanies,
      filterServices,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );

    const { auditItems } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
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
      auditItems,
    });

    ctx.dispatch(new LoadAuditListGraphsData());
  }

  @Action(UpdateAuditListGraphFilteredDateRange)
  updateAuditListGraphFilteredDateRange(
    ctx: StateContext<AuditListGraphStateModel>,
    { data }: UpdateAuditListGraphFilteredDateRange,
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

    const { auditItems: auditItemsForTheDate } =
      AuditListGraphMapperService.recalculateState(
        state.allAuditItems,
        state.filterCompanies,
        state.filterServices,
        state.filterSites,
        filterStartDate,
        filterEndDate,
      );

    if (auditItemsForTheDate.length === 0) {
      ctx.patchState({
        dataCompanies: [],
        dataServices: [],
        dataSites: [],
        filterCompanies: [],
        filterServices: [],
        filterSites: [],
        auditItems: [],
      });
      ctx.dispatch(new LoadAuditListGraphsData());

      return;
    }

    const { dataCompanies } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      [],
      state.filterServices,
      state.filterSites,
      filterStartDate,
      filterEndDate,
    );

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const { dataServices } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      filterCompanies,
      [],
      state.filterSites,
      filterStartDate,
      filterEndDate,
    );

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const { dataSites } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
      filterCompanies,
      filterServices,
      [],
      filterStartDate,
      filterEndDate,
    );

    state = this.patchAndGetState(ctx, {
      dataCompanies,
      dataServices,
      dataSites,
    });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { auditItems } = AuditListGraphMapperService.recalculateState(
      state.allAuditItems,
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
      auditItems,
    });

    ctx.dispatch(new LoadAuditListGraphsData());
  }

  @Action(UpdateAuditListGraphData)
  updateAuditListGraphData(
    ctx: StateContext<AuditListGraphStateModel>,
    { audits }: UpdateAuditListGraphData,
  ) {
    const auditStatusDoughnutGraphData =
      AuditGraphsMapperService.mapToAuditStatusDoughnutGraphModel(
        AuditListGraphMapperService.calculateAuditStatusStats(audits),
      );
    const auditStatusBarGraphData =
      AuditGraphsMapperService.mapToAuditStatusBarTypeGraphModel(
        AuditListGraphMapperService.calculateAuditByTypeStatusStats(audits),
      );

    ctx.patchState({
      auditStatusDoughnutGraphData,
      auditStatusBarGraphData,
    });
  }

  @Action(ResetAuditListGraphFiltersExceptDateToCurrentYear)
  resetAuditListGraphFiltersExceptDateToCurrentYear(
    ctx: StateContext<AuditListGraphStateModel>,
  ) {
    const { startOfYear, endOfYear } = getCurrentYearRange();
    const { activeTab } = ctx.getState();

    if (activeTab === AuditChartsTabs.AuditDays) {
      this.resetAllFiltersExceptDate(ctx, startOfYear, endOfYear);
    } else {
      this.resetAllFiltersExceptDate(ctx, null, null);
    }
  }

  @Action(ResetAuditsListGraphState)
  resetAuditsListGraphState(ctx: StateContext<AuditListGraphStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(NavigateFromAuditListChartToListView)
  navigateFromAuditListChartToListView(
    ctx: StateContext<AuditListGraphStateModel>,
    { tooltipFilters }: NavigateFromAuditListChartToListView,
  ) {
    const state = ctx.getState();
    const {
      filterStartDate,
      filterEndDate,
      dataServices,
      filterServices,
      dataCompanies,
      filterCompanies,
      filterSites,
      auditItems,
    } = state;

    const filterColumnMappings: DrillDownFilterColumnMapping = {
      date: 'startDate',
      services: 'service',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
    };

    const dateFilters =
      filterStartDate &&
      filterEndDate &&
      shouldApplyFilter(tooltipFilters, filterColumnMappings.date)
        ? formatFilterOnlyDate(
            [filterStartDate, filterEndDate],
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

    const allSiteDetails =
      filterSites && filterSites.length > 0
        ? auditItems
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

    const companyFilters = extractAppliedFilters(
      dataCompanies,
      filterCompanies,
      filterColumnMappings.companyName,
    );

    const updatedFilters = [
      ...tooltipFilters,
      ...dateFilters,
      ...serviceFilters,
      ...citiesFilters,
      ...siteFilters,
      ...companyFilters,
    ];

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/audits']));
  }

  // #region AuditDaysGraphs
  @Action(LoadAuditListGraphsData)
  loadAuditListGraphsData(ctx: StateContext<AuditListGraphStateModel>) {
    const { activeTab, auditItems } = ctx.getState();

    const actionsMap = {
      [AuditChartsTabs.AuditStatus]: [new UpdateAuditListGraphData(auditItems)],
      [AuditChartsTabs.AuditDays]: [
        new LoadAuditListDaysDoughnutGraphData(),
        new LoadAuditListDaysBarGraphData(),
        new LoadAuditListDaysGridData(),
      ],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  @Action(LoadAuditListDaysDoughnutGraphData)
  loadListAuditDaysDoughnutGraphData(
    ctx: StateContext<AuditListGraphStateModel>,
  ) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditGraphsService
      .getAuditDaysDoughnutGraphData(
        filterStartDate!,
        filterEndDate!,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditDaysDoughnutGraphDto) => {
          const auditDaysDoughnutGraphData =
            AuditGraphsMapperService.mapToAuditDaysDoughnutGraphModel(
              auditDaysDoughnutGraphDto,
            );

          ctx.dispatch(
            new LoadAuditListDaysDoughnutGraphDataSuccess(
              auditDaysDoughnutGraphData,
            ),
          );
        }),
      );
  }

  @Action(LoadAuditListDaysDoughnutGraphDataSuccess)
  loadAuditListDaysDoughnutGraphDataSuccess(
    ctx: StateContext<AuditListGraphStateModel>,
    { auditDaysDoughnutGraphData }: LoadAuditListDaysDoughnutGraphDataSuccess,
  ) {
    ctx.patchState({ auditDaysDoughnutGraphData });
  }

  @Action(LoadAuditListDaysBarGraphData)
  loadAuditListDaysBarGraphData(ctx: StateContext<AuditListGraphStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditGraphsService
      .getAuditDaysBarGraphData(
        filterStartDate!,
        filterEndDate!,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditDaysBarGraphDto) => {
          const auditDaysBarGraphData =
            AuditGraphsMapperService.mapToAuditDaysBarTypeGraphModel(
              auditDaysBarGraphDto,
            );

          ctx.dispatch(
            new LoadAuditListDaysBarGraphDataSuccess(auditDaysBarGraphData),
          );
        }),
      );
  }

  @Action(LoadAuditListDaysBarGraphDataSuccess)
  loadAuditListDaysBarGraphDataSuccess(
    ctx: StateContext<AuditListGraphStateModel>,
    { auditDaysBarGraphData }: LoadAuditListDaysBarGraphDataSuccess,
  ) {
    ctx.patchState({ auditDaysBarGraphData });
  }

  @Action(LoadAuditListDaysGridData)
  loadAuditListDaysGridData(ctx: StateContext<AuditListGraphStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditDaysGridService
      .getAuditDaysGridData(
        filterStartDate!,
        filterEndDate!,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditDaysGridDto) => {
          const auditDaysGridData =
            AuditDaysGridMapperService.mapToAuditDaysGridModel(
              auditDaysGridDto,
            );

          ctx.dispatch(new LoadAuditListDaysGridDataSuccess(auditDaysGridData));
        }),
      );
  }

  @Action(LoadAuditListDaysGridDataSuccess)
  loadAuditListDaysGraphDataSuccess(
    ctx: StateContext<AuditListGraphStateModel>,
    { auditDaysGridData }: LoadAuditListDaysGridDataSuccess,
  ) {
    ctx.patchState({ auditDaysGridData });
  }

  @Action(NavigateFromAuditListChartTreeToListView)
  navigateFromAuditListChartTreeToListView(
    ctx: StateContext<AuditListGraphStateModel>,
    { filterValue }: NavigateFromAuditListChartTreeToListView,
  ) {
    const treeFilter: FilterValue[] = [
      {
        label: filterValue.label,
        value: [
          {
            label: filterValue.value,
            value: filterValue.value,
          },
        ],
      },
    ];

    const state = ctx.getState();
    const { filterStartDate, filterEndDate } = state;

    const filterColumnMappings: Pick<DrillDownFilterColumnMapping, 'date'> = {
      date: 'startDate',
    };

    const dateFilters = formatFilter(
      [filterStartDate!, filterEndDate!],
      filterColumnMappings.date,
    );

    const updatedFilters = [...treeFilter, ...dateFilters];

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/audits']));
  }

  // #endregion AuditDaysGraphs

  private prune<T>(data: { value: T }[], originalFilter: T[] = []): T[] {
    const available = data.map((d) => d.value);
    const filtered = (originalFilter || []).filter((f) =>
      available.includes(f),
    );

    return filtered;
  }

  private patchAndGetState(
    ctx: StateContext<AuditListGraphStateModel>,
    patch: Partial<AuditListGraphStateModel>,
  ): AuditListGraphStateModel {
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
    ctx: StateContext<AuditListGraphStateModel>,
    filterStartDate: Date | null,
    filterEndDate: Date | null,
  ) {
    const state = ctx.getState();
    const { auditItems, dataCompanies, dataServices, dataSites } =
      AuditListGraphMapperService.recalculateState(
        state.allAuditItems,
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
      auditItems,
      dataCompanies,
      dataServices,
      dataSites,
    });
  }
}
