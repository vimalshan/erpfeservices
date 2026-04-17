import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import {
  extractAppliedFilters,
  formatFilter,
} from '@customer-portal/shared/helpers/grid';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
  DrillDownFilterColumnMapping,
  SharedSelectTreeChangeEventOutput,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';

import { CertificateChartFilterKey } from '../constants';
import { CertificateListItemEnrichedDto } from '../dtos';
import { CertificatesTabs } from '../models';
import {
  CertificateGraphsMapperService,
  CertificateListGraphMapperService,
  CertificateListService,
} from '../services';
import {
  LoadCertificateListAndGraphFilters,
  LoadCertificateListGraphData,
  LoadCertificatesBySiteListData,
  LoadCertificatesByStatusListGraphData,
  LoadCertificatesByTypeListGraphData,
  NavigateFromListChartToListView,
  ResetCertificateListGraphData,
  ResetCertificateListGraphFiltersExceptDateToCurrentYear,
  ResetCertificateListGraphState,
  ResetCertificatesBySiteListData,
  ResetCertificatesByStatusListGraphData,
  ResetCertificatesByTypeListGraphData,
  SetActiveCertificatesListGraphTab,
  SetNavigationGridConfig,
  UpdateCertificateListGraphFilterByKey,
  UpdateCertificateListGraphFilterCompanies,
  UpdateCertificateListGraphFilteredDateRange,
  UpdateCertificateListGraphFilterServices,
  UpdateCertificateListGraphFilterSites,
} from './actions';

export interface CertificateListGraphStateModel {
  activeTab: CertificatesTabs;
  certificatesByStatusGraphData: DoughnutChartModel;
  certificatesByTypeGraphData: BarChartModel;
  certificatesBySiteColumns: Record<string, TreeColumnDefinition[]>;
  allCertificateItems: CertificateListItemEnrichedDto[];
  certificateItems: CertificateListItemEnrichedDto[];
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
  sites: {
    loading: boolean;
    error: string | null;
    list: TreeNode[];
  };
}

const defaultState: CertificateListGraphStateModel = {
  activeTab: CertificatesTabs.CertificatesStatus,
  certificatesByStatusGraphData: EMPTY_GRAPH_DATA,
  certificatesByTypeGraphData: EMPTY_GRAPH_DATA,
  certificatesBySiteColumns: {
    frozenColumns: [],
    scrollableColumns: [],
  },
  allCertificateItems: [],
  certificateItems: [],
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
  sites: {
    loading: false,
    error: '',
    list: [],
  },
};

@State<CertificateListGraphStateModel>({
  name: 'certificateListGraph',
  defaults: defaultState,
})
@Injectable()
export class CertificateListGraphState {
  constructor(
    private certificateListService: CertificateListService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
  ) {}

  @Action(SetActiveCertificatesListGraphTab)
  setActiveCertificatesTab(
    ctx: StateContext<CertificateListGraphStateModel>,
    { activeTab }: SetActiveCertificatesListGraphTab,
  ) {
    ctx.patchState({ activeTab });
  }

  @Action(LoadCertificateListAndGraphFilters)
  loadCertificateListAndGraphFilters(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    const serviceMasterList =
      this.globalServiceMasterStoreService.serviceMasterList();
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();

    return this.certificateListService.getCertificateList().pipe(
      tap((certificateListDto) => {
        const allCertificateItems = certificateListDto?.data || [];

        const enrichedCertificateItems =
          CertificateListGraphMapperService.enrichCertificateItems(
            allCertificateItems,
            siteMasterList,
            serviceMasterList,
          );

        const {
          certificateItems: filtered,
          dataCompanies,
          dataServices,
          dataSites,
        } = CertificateListGraphMapperService.recalculateState(
          enrichedCertificateItems,
          [],
          [],
          [],
          null,
          null,
        );

        ctx.patchState({
          allCertificateItems: enrichedCertificateItems,
          certificateItems: filtered,
          dataCompanies,
          dataServices,
          dataSites,
          filterStartDate: null,
          filterEndDate: null,
        });

        ctx.dispatch(new LoadCertificateListGraphData());
      }),
    );
  }

  @Action(UpdateCertificateListGraphFilterByKey)
  updateCertificateListGraphFilterByKey(
    ctx: StateContext<CertificateListGraphStateModel>,
    { data, key }: UpdateCertificateListGraphFilterByKey,
  ) {
    const actionsMap = {
      [CertificateChartFilterKey.Companies]: [
        new UpdateCertificateListGraphFilterCompanies(data as number[]),
      ],
      [CertificateChartFilterKey.Services]: [
        new UpdateCertificateListGraphFilterServices(data as number[]),
      ],
      [CertificateChartFilterKey.Sites]: [
        new UpdateCertificateListGraphFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
      [CertificateChartFilterKey.TimeRange]: [
        new UpdateCertificateListGraphFilteredDateRange(data as Date[]),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateCertificateListGraphFilterCompanies)
  updateCertificateListGraphFilterCompanies(
    ctx: StateContext<CertificateListGraphStateModel>,
    { data }: UpdateCertificateListGraphFilterCompanies,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterCompanies: data,
      originalFilterCompanies: data,
    });
    const { dataServices } = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
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

    const { dataSites } = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
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

    const { certificateItems } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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
      certificateItems,
    });

    ctx.dispatch(new LoadCertificateListGraphData());
  }

  @Action(UpdateCertificateListGraphFilterServices)
  updateCertificateListGraphFilterServices(
    ctx: StateContext<CertificateListGraphStateModel>,
    { data }: UpdateCertificateListGraphFilterServices,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterServices: data,
      originalFilterServices: data,
    });

    const { dataCompanies } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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

    const { dataSites } = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
      filterCompanies,
      data,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { certificateItems } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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
      certificateItems,
    });

    ctx.dispatch(new LoadCertificateListGraphData());
  }

  @Action(UpdateCertificateListGraphFilterSites)
  updateCertificateListGraphFilterSites(
    ctx: StateContext<CertificateListGraphStateModel>,
    { data }: UpdateCertificateListGraphFilterSites,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterSites: data.filter as number[],
      originalFilterSites: data.filter as number[],
    });

    const { dataCompanies } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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

    const { dataServices } = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
      filterCompanies,
      [],
      data.filter as number[],
      state.filterStartDate,
      state.filterEndDate,
    );

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const { dataSites } = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
      filterCompanies,
      filterServices,
      [],
      state.filterStartDate,
      state.filterEndDate,
    );

    const { certificateItems } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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
      certificateItems,
    });

    ctx.dispatch(new LoadCertificateListGraphData());
  }

  @Action(UpdateCertificateListGraphFilteredDateRange)
  updateCertificateListGraphFilteredDateRange(
    ctx: StateContext<CertificateListGraphStateModel>,
    { data }: UpdateCertificateListGraphFilteredDateRange,
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

    const { certificateItems: certificateItemsForTheDate } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
        state.filterCompanies,
        state.filterServices,
        state.filterSites,
        filterStartDate,
        filterEndDate,
      );

    if (certificateItemsForTheDate.length === 0) {
      ctx.patchState({
        dataCompanies: [],
        dataServices: [],
        dataSites: [],
        filterCompanies: [],
        filterServices: [],
        filterSites: [],
        certificateItems: [],
      });
      ctx.dispatch(new LoadCertificateListGraphData());

      return;
    }

    const { dataCompanies } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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

    const { dataServices } = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
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

    const sitesFiltered = CertificateListGraphMapperService.recalculateState(
      state.allCertificateItems,
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

    const { certificateItems } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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
      certificateItems,
    });

    ctx.dispatch(new LoadCertificateListGraphData());
  }
  // region start graph data loading actions

  @Action(LoadCertificateListGraphData)
  loadCertificateListGraphData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [CertificatesTabs.CertificatesStatus]: [
        new LoadCertificatesByStatusListGraphData(),
        new LoadCertificatesByTypeListGraphData(),
      ],
      [CertificatesTabs.CertificatesBySite]: [
        new LoadCertificatesBySiteListData(),
      ],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  @Action(LoadCertificatesByStatusListGraphData)
  loadCertificatesByStatusListGraphData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    const { certificateItems } = ctx.getState();

    const certificatesByStatusGraphDto =
      CertificateListGraphMapperService.buildCertificatesByStatusGraphDto(
        certificateItems,
      );

    const certificatesByStatusGraphData =
      CertificateGraphsMapperService.mapToCertificateByStatusGraphModel(
        certificatesByStatusGraphDto,
      );

    ctx.patchState({
      certificatesByStatusGraphData,
    });
  }

  @Action(ResetCertificatesByStatusListGraphData)
  resetCertificatesByStatusListGraphData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    ctx.patchState({ certificatesByStatusGraphData: EMPTY_GRAPH_DATA });
  }

  @Action(LoadCertificatesByTypeListGraphData)
  loadCertificatesByTypeListGraphData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    const { certificateItems, filterServices } = ctx.getState();

    const certificatesByTypeGraphDto =
      CertificateListGraphMapperService.buildCertificatesByTypeGraphDto(
        certificateItems,
        filterServices,
      );

    const certificatesByTypeGraphData =
      CertificateGraphsMapperService.mapToCertificatesByTypeGraphModel(
        certificatesByTypeGraphDto,
      );

    ctx.patchState({ certificatesByTypeGraphData });
  }

  @Action(ResetCertificatesByTypeListGraphData)
  resetCertificatesByTypeListGraphData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    ctx.patchState({ certificatesByTypeGraphData: EMPTY_GRAPH_DATA });
  }

  @Action(LoadCertificatesBySiteListData)
  loadCertificatesBySiteListData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    const { certificateItems, filterServices, filterSites } = ctx.getState();

    const certificatesBySiteDto =
      CertificateListGraphMapperService.buildCertificatesBySiteDto(
        certificateItems,
        filterServices,
        filterSites,
      );

    const columns = CertificateGraphsMapperService.generateColumnsForSites(
      certificatesBySiteDto.data.services,
    );
    const data = CertificateGraphsMapperService.mapToCertificateBySiteModel(
      certificatesBySiteDto.data,
    );

    ctx.patchState({
      sites: {
        list: data,
        loading: false,
        error: '',
      },
      certificatesBySiteColumns: columns,
    });
  }

  @Action(ResetCertificatesBySiteListData)
  resetCertificatesBySiteListData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    ctx.patchState({
      sites: {
        loading: false,
        error: '',
        list: [],
      },
    });
  }

  @Action(ResetCertificateListGraphData)
  resetCertificateListGraphData(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [CertificatesTabs.CertificatesStatus]: [
        new ResetCertificatesByStatusListGraphData(),
        new ResetCertificatesByTypeListGraphData(),
      ],
      [CertificatesTabs.CertificatesBySite]: [
        new ResetCertificatesBySiteListData(),
      ],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  @Action(NavigateFromListChartToListView)
  navigateFromListChartToListView(
    ctx: StateContext<CertificateListGraphStateModel>,
    { tooltipFilters }: NavigateFromListChartToListView,
  ) {
    const state = ctx.getState();

    const filterColumnMappings: DrillDownFilterColumnMapping = {
      date: 'validUntil',
      services: 'service',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
    };

    const serviceFilters = tooltipFilters.some(
      (filter) => filter.label === filterColumnMappings.services,
    )
      ? []
      : extractAppliedFilters(
          state.dataServices,
          state.filterServices,
          filterColumnMappings.services,
        );

    const companyNameFilters = tooltipFilters.some(
      (filter) => filter.label === filterColumnMappings.companyName,
    )
      ? []
      : extractAppliedFilters(
          state.dataCompanies,
          state.filterCompanies,
          filterColumnMappings.companyName,
        );

    const allSiteDetails =
      state.filterSites && state.filterSites.length > 0
        ? state.allCertificateItems
            .flatMap((a) => a.siteDetails || [])
            .filter((s) => state.filterSites.includes(s.id))
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

    const updatedFilters = [
      ...tooltipFilters,
      ...serviceFilters,
      ...citiesFilters,
      ...siteFilters,
      ...companyNameFilters,
    ];

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/certificates']));
  }

  // region end graph data loading actions

  @Action(ResetCertificateListGraphFiltersExceptDateToCurrentYear)
  resetCertificateListGraphFiltersExceptDateToCurrentYear(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    this.resetAllFiltersExceptDate(ctx, null, null);
  }

  @Action(ResetCertificateListGraphState)
  resetCertificateListGraphState(
    ctx: StateContext<CertificateListGraphStateModel>,
  ) {
    ctx.setState(defaultState);
  }

  private prune<T>(data: { value: T }[], originalFilter: T[] = []): T[] {
    const available = data.map((d) => d.value);
    const filtered = (originalFilter || []).filter((f) =>
      available.includes(f),
    );

    return filtered;
  }

  private patchAndGetState(
    ctx: StateContext<CertificateListGraphStateModel>,
    patch: Partial<CertificateListGraphStateModel>,
  ): CertificateListGraphStateModel {
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
    ctx: StateContext<CertificateListGraphStateModel>,
    filterStartDate: Date | null,
    filterEndDate: Date | null,
  ) {
    const state = ctx.getState();
    const { certificateItems, dataCompanies, dataServices, dataSites } =
      CertificateListGraphMapperService.recalculateState(
        state.allCertificateItems,
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
      certificateItems,
      dataCompanies,
      dataServices,
      dataSites,
    });

    ctx.dispatch(new LoadCertificateListGraphData());
  }
}
