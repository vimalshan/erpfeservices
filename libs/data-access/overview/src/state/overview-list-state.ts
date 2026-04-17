import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import { SetNavigationFilters } from '@customer-portal/overview-shared';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getYearBoundsAsDates } from '@customer-portal/shared/helpers/date';
import {
  extractAppliedFilters,
  formatFilter,
} from '@customer-portal/shared/helpers/grid';
import {
  CardDataModel,
  CardNavigationPayload,
  CustomTreeNode,
  DrillDownFilterColumnMapping,
  FilterValue,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { OverviewFilterTypes } from '../constants';
import { OverviewCompanyServiceSiteFilterResponse } from '../dtos';
import { OverviewCardPageInfoModel } from '../models';
import {
  OverviewFilterService,
  OverviewListMapperService,
  OverviewService,
} from '../services';
import {
  LoadMoreOverviewListCardData,
  LoadOverviewListCardData,
  LoadOverviewListCardDataFail,
  LoadOverviewListCardDataSuccess,
  LoadOverviewListFilters,
  LoadOverviewListFiltersFail,
  NavigateFromOverviewListCardToListView,
  ResetOverviewListFilterState,
  ResetOverviewListState,
  UpdateOverviewListFilterByKey,
  UpdateOverviewListFilterCompanies,
  UpdateOverviewListFilterServices,
  UpdateOverviewListFilterSites,
} from './actions';

export interface OverviewListStateModel {
  overviewCompanyServiceSiteFilterResponse: OverviewCompanyServiceSiteFilterResponse[];
  originalFilterCompanies: number[];
  originalFilterServices: number[];
  originalFilterSites: number[];
  filterCompanies: number[];
  filterServices: number[];
  filterSites: number[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataSites: CustomTreeNode[];
  entityRelations?: ReturnType<
    typeof OverviewListMapperService.buildEntityRelations
  >;
  filtersStatus: {
    loaded: boolean;
    isLoading: boolean;
    error: string | null;
  };
  serviceMap: Map<number, string>;
  siteMap: Map<number, string>;
  companyMap: Map<number, string>;
  pageInfo: OverviewCardPageInfoModel;
  isLoading: boolean;
  error: string | null;
  overviewCardData: CardDataModel[];
  allOverviewCardData: CardDataModel[];
}

const defaultState: OverviewListStateModel = {
  overviewCompanyServiceSiteFilterResponse: [],
  originalFilterCompanies: [],
  originalFilterServices: [],
  originalFilterSites: [],
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  filtersStatus: {
    loaded: false,
    isLoading: false,
    error: null,
  },
  serviceMap: new Map<number, string>(),
  siteMap: new Map<number, string>(),
  companyMap: new Map<number, string>(),
  entityRelations: undefined,
  pageInfo: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  overviewCardData: [],
  allOverviewCardData: [],
};

@State<OverviewListStateModel>({
  name: 'overviewList',
  defaults: defaultState,
})
@Injectable()
export class OverviewListState {
  private overviewPageSize = 4;

  constructor(
    private readonly overviewService: OverviewService,
    private readonly overviewFilterService: OverviewFilterService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
  ) {}

  @Action(LoadOverviewListCardData)
  loadOverviewListCardData(
    ctx: StateContext<OverviewListStateModel>,
    { shouldKeepPreviousData }: LoadOverviewListCardData,
  ) {
    ctx.patchState({
      isLoading: true,
      error: '',
    });
    const { filterCompanies, filterServices, filterSites } = ctx.getState();

    return this.overviewService
      .getOverviewCardDataModified(filterCompanies, filterServices, filterSites)
      .pipe(
        throwIfNotSuccess(),
        tap((overviewCardsDto) => {
          const allOverviewCardData =
            OverviewListMapperService.mapToOverviewCardModel(
              overviewCardsDto.data,
            );
          const totalItems = allOverviewCardData?.length ?? 0;
          const totalPages = Math.ceil(totalItems / this.overviewPageSize);

          if (allOverviewCardData) {
            ctx.patchState({
              allOverviewCardData,
              pageInfo: {
                currentPage: 1,
                totalItems,
                totalPages,
              },
            });
            ctx.dispatch(
              new LoadOverviewListCardDataSuccess(shouldKeepPreviousData),
            );
          } else {
            ctx.patchState({
              allOverviewCardData: [],
              overviewCardData: [],
              isLoading: false,
              error: '',
              pageInfo: {
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
              },
            });
          }
        }),
        catchError(() => ctx.dispatch(new LoadOverviewListCardDataFail())),
      );
  }

  @Action(LoadOverviewListCardDataSuccess)
  loadOverviewListCardDataSuccess(
    ctx: StateContext<OverviewListStateModel>,
    { shouldKeepPreviousData }: LoadOverviewListCardDataSuccess,
  ): void {
    let newOverviewCardData: CardDataModel[] = [];
    const allOverviewCardData = ctx.getState().allOverviewCardData || [];
    const { currentPage } = ctx.getState().pageInfo;

    if (shouldKeepPreviousData) {
      const start = (currentPage - 1) * this.overviewPageSize;
      const end = currentPage * this.overviewPageSize;
      newOverviewCardData = [
        ...ctx.getState().overviewCardData,
        ...allOverviewCardData.slice(start, end),
      ];
    } else {
      newOverviewCardData = allOverviewCardData.slice(0, this.overviewPageSize);
    }

    ctx.patchState({
      overviewCardData: newOverviewCardData,
      isLoading: false,
      error: '',
    });
  }

  @Action(LoadOverviewListCardDataFail)
  loadOverviewListCardDataFail(ctx: StateContext<any>) {
    ctx.patchState({
      isLoading: false,
      error: 'Failed to load Overview data',
      overviewCardData: [],
    });
  }

  @Action(LoadMoreOverviewListCardData)
  loadMoreOverviewListCardData(ctx: StateContext<OverviewListStateModel>) {
    const { pageInfo } = ctx.getState();

    ctx.patchState({
      pageInfo: {
        ...pageInfo,
        currentPage: pageInfo.currentPage + 1,
      },
    });

    return ctx.dispatch(new LoadOverviewListCardDataSuccess(true));
  }

  @Action(LoadOverviewListFilters)
  loadOverviewListFilters(ctx: StateContext<OverviewListStateModel>) {
    ctx.patchState({
      filtersStatus: {
        loaded: false,
        isLoading: true,
        error: null,
      },
    });

    const serviceMasterList =
      this.globalServiceMasterStoreService.serviceMasterList();
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();

    return this.overviewFilterService.getOverviewFilters().pipe(
      throwIfNotSuccess(),
      tap((overviewListFilterDto) => {
        const items = overviewListFilterDto?.data || [];
        const {
          dataCompanies,
          dataServices,
          dataSites,
          companyMap,
          serviceMap,
          siteMap,
        } = OverviewListMapperService.calculateOverviewFilters(
          items,
          serviceMasterList,
          siteMasterList,
        );
        const entityRelations =
          OverviewListMapperService.buildEntityRelations(items);
        ctx.patchState({
          overviewCompanyServiceSiteFilterResponse: items,
          dataCompanies,
          dataServices,
          dataSites,
          entityRelations,
          companyMap,
          serviceMap,
          siteMap,
          filtersStatus: {
            loaded: true,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((err) => ctx.dispatch(new LoadOverviewListFiltersFail(err))),
    );
  }

  @Action(LoadOverviewListFiltersFail)
  loadOverviewListFiltersFail(
    ctx: StateContext<any>,
    { error }: LoadOverviewListFiltersFail,
  ) {
    ctx.patchState({
      filtersStatus: {
        loaded: false,
        isLoading: false,
        error: error?.message || 'Failed to load filters',
      },
    });
  }

  @Action(UpdateOverviewListFilterByKey)
  updateOverviewListFilterByKey(
    ctx: StateContext<OverviewListStateModel>,
    { data, key }: UpdateOverviewListFilterByKey,
  ) {
    const actionsMap = {
      [OverviewFilterTypes.Companies]: [
        new UpdateOverviewListFilterCompanies(data as number[]),
      ],
      [OverviewFilterTypes.Services]: [
        new UpdateOverviewListFilterServices(data as number[]),
      ],
      [OverviewFilterTypes.Sites]: [
        new UpdateOverviewListFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
    };

    ctx.patchState({
      pageInfo: {
        ...ctx.getState().pageInfo,
        currentPage: 1,
      },
      overviewCardData: [],
      error: null,
    });

    ctx.dispatch(actionsMap[key]);

    ctx.dispatch(new LoadOverviewListCardData());
  }

  @Action(ResetOverviewListFilterState)
  resetOverviewListFilterState(ctx: StateContext<OverviewListStateModel>) {
    const state = ctx.getState();
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();
    const { dataCompanies, dataServices, dataSites } =
      OverviewListMapperService.resetOverviewFilters(
        state.companyMap,
        state.serviceMap,
        state.overviewCompanyServiceSiteFilterResponse,
        siteMasterList,
      );

    ctx.patchState({
      dataCompanies,
      dataServices,
      dataSites,
      filterCompanies: [],
      filterServices: [],
      filterSites: [],
      originalFilterCompanies: [],
      originalFilterServices: [],
      originalFilterSites: [],
    });

    ctx.dispatch(new LoadOverviewListCardData());
  }

  @Action(ResetOverviewListState)
  resetOverviewListState(ctx: StateContext<OverviewListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(UpdateOverviewListFilterCompanies)
  updateOverviewListFilterCompanies(
    ctx: StateContext<OverviewListStateModel>,
    { data }: UpdateOverviewListFilterCompanies,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterCompanies: data,
      originalFilterCompanies: data,
    });

    const dataServices = this.getRelatedServiceIdsForCompaniesAndSites(
      data,
      state.filterSites,
      state.serviceMap,
      state.entityRelations,
    );

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const dataSites = this.getRelatedSiteIdsForCompaniesAndServices(
      state.overviewCompanyServiceSiteFilterResponse,
      data,
      filterServices,
      state.entityRelations,
    );

    state = this.patchAndGetState(ctx, {
      dataSites,
      dataServices,
    });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    ctx.patchState({
      dataServices,
      dataSites,
      filterServices,
      filterSites,
    });
  }

  @Action(UpdateOverviewListFilterServices)
  updateOverviewListFilterServices(
    ctx: StateContext<OverviewListStateModel>,
    { data }: UpdateOverviewListFilterServices,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterServices: data,
      originalFilterServices: data,
    });

    const dataCompanies = this.getRelatedCompanyIdsForServicesAndSites(
      data,
      state.filterSites,
      state.companyMap,
      state.entityRelations,
    );

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const dataSites = this.getRelatedSiteIdsForServicesAndCompanies(
      state.overviewCompanyServiceSiteFilterResponse,
      data,
      filterCompanies,
      state.entityRelations,
    );

    state = this.patchAndGetState(ctx, { dataCompanies, dataSites });

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    ctx.patchState({
      dataCompanies,
      dataSites,
      filterCompanies,
      filterSites,
    });
  }

  @Action(UpdateOverviewListFilterSites)
  updateOverviewListFilterSites(
    ctx: StateContext<OverviewListStateModel>,
    { data }: UpdateOverviewListFilterSites,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterSites: data.filter as number[],
      originalFilterSites: data.filter as number[],
    });

    const dataCompanies = this.getRelatedCompanyIdsForSitesAndServices(
      data.filter as number[],
      state.filterServices,
      state.companyMap,
      state.entityRelations,
    );

    const filterCompanies = this.prune(
      dataCompanies,
      ctx.getState().originalFilterCompanies,
    );

    const dataServices = this.getRelatedServiceIdsForSitesAndCompanies(
      data.filter as number[],
      filterCompanies,
      state.serviceMap,
      state.entityRelations,
    );

    state = this.patchAndGetState(ctx, { dataCompanies, dataServices });

    const filterServices = this.prune(
      dataServices,
      ctx.getState().originalFilterServices,
    );

    const dataSites = this.getRelatedSiteIdsForCompaniesAndServices(
      state.overviewCompanyServiceSiteFilterResponse,
      filterCompanies,
      filterServices,
      state.entityRelations,
    );

    ctx.patchState({
      filterCompanies,
      filterServices,
      dataCompanies,
      dataServices,
      dataSites,
    });
  }

  @Action(NavigateFromOverviewListCardToListView)
  navigateFromOverviewListCardToListView(
    ctx: StateContext<OverviewListStateModel>,
    { payload }: NavigateFromOverviewListCardToListView,
  ) {
    const redirectionMap: Record<string, string> = {
      audit: '/audits',
      schedule: '/schedule/list',
      findings: '/findings',
      certificates: '/certificates',
    };

    const { entity } = payload;

    const route = redirectionMap[entity];

    if (!route) {
      return;
    }

    const state = ctx.getState();
    const overviewFilters = this.generateCardNavigationFilters(payload, state);

    ctx.dispatch(new SetNavigationFilters(overviewFilters));

    ctx.dispatch(new Navigate([route]));
  }

  private getRelatedServiceIdsForCompaniesAndSites(
    companyIds: number[],
    filterSites: number[],
    serviceMap: Map<number, string>,
    relations?: ReturnType<
      typeof OverviewListMapperService.buildEntityRelations
    >,
  ): SharedSelectMultipleDatum<number>[] {
    if (
      !relations ||
      !relations.companyToServices ||
      !relations.serviceToSites
    ) {
      return [];
    }

    const serviceSet = new Set<number>();

    if (!companyIds || companyIds.length === 0) {
      Array.from(serviceMap.keys()).forEach((id) => serviceSet.add(id));
    } else {
      (companyIds || []).forEach((companyId) => {
        relations.companyToServices
          .get(companyId)
          ?.forEach((serviceId) => serviceSet.add(serviceId));
      });
    }

    if (filterSites.length > 0) {
      Array.from(serviceSet).forEach((serviceId) => {
        const relatedSites = relations.serviceToSites.get(serviceId);
        const hasMatchingSite =
          relatedSites &&
          filterSites.some((siteId) => relatedSites.has(siteId));

        if (!hasMatchingSite) {
          serviceSet.delete(serviceId);
        }
      });
    }

    const dataServices = this.mapServiceSetToDataServices(
      serviceSet,
      serviceMap,
    );

    return dataServices;
  }

  private getRelatedSiteIdsForCompaniesAndServices(
    items: OverviewCompanyServiceSiteFilterResponse[],
    companyIds: number[],
    serviceIds: number[],
    relations?: ReturnType<
      typeof OverviewListMapperService.buildEntityRelations
    >,
  ): CustomTreeNode[] {
    if (
      !relations ||
      !relations.companyToSites ||
      !relations.serviceToCompanies ||
      !relations.serviceToSites
    ) {
      return [];
    }
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();
    const siteSet = new Set<number>();

    if (!companyIds || companyIds.length === 0) {
      relations.companyToSites?.forEach((siteIdsSet) => {
        siteIdsSet.forEach((siteId) => siteSet.add(siteId));
      });
    } else {
      (companyIds || []).forEach((companyId) => {
        relations.companyToSites
          .get(companyId)
          ?.forEach((siteId) => siteSet.add(siteId));
      });
    }

    if (serviceIds.length > 0) {
      Array.from(siteSet).forEach((siteId) => {
        const relatedServices = relations.siteToServices.get(siteId);
        const hasMatchingService =
          relatedServices &&
          serviceIds.some((serviceId) => relatedServices.has(serviceId));

        if (!hasMatchingService) {
          siteSet.delete(siteId);
        }
      });
    }

    return this.getSortedOverviewFilterSitesDto(
      items,
      siteMasterList,
      siteSet,
      serviceIds,
      companyIds,
    );
  }

  private getRelatedCompanyIdsForServicesAndSites(
    serviceIds: number[],
    filterSites: number[],
    companyMap: Map<number, string>,
    relations?: ReturnType<
      typeof OverviewListMapperService.buildEntityRelations
    >,
  ): SharedSelectMultipleDatum<number>[] {
    if (
      !relations ||
      !relations.serviceToCompanies ||
      !relations.serviceToSites
    ) {
      return [];
    }

    const companySet = new Set<number>();

    if (!serviceIds || serviceIds.length === 0) {
      Array.from(companyMap.keys()).forEach((id) => companySet.add(id));
    } else {
      (serviceIds || []).forEach((serviceId) => {
        relations.serviceToCompanies
          .get(serviceId)
          ?.forEach((companyId) => companySet.add(companyId));
      });
    }

    if (filterSites.length > 0) {
      Array.from(companySet).forEach((companyId) => {
        const relatedSites = relations.companyToSites.get(companyId);
        const hasMatchingSite =
          relatedSites &&
          filterSites.some((siteId) => relatedSites.has(siteId));

        if (!hasMatchingSite) {
          companySet.delete(companyId);
        }
      });
    }

    const dataCompanies = this.mapCompanySetToDataCompanies(
      companySet,
      companyMap,
    );

    return dataCompanies;
  }

  private getRelatedSiteIdsForServicesAndCompanies(
    items: OverviewCompanyServiceSiteFilterResponse[],
    serviceIds: number[],
    companyIds: number[],
    relations?: ReturnType<
      typeof OverviewListMapperService.buildEntityRelations
    >,
  ): CustomTreeNode[] {
    if (
      !relations ||
      !relations.serviceToSites ||
      !relations.companyToSites ||
      !relations.siteToCompanies
    ) {
      return [];
    }
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();
    const siteSet = new Set<number>();

    if (!serviceIds || serviceIds.length === 0) {
      relations.serviceToSites?.forEach((siteIdsSet) => {
        siteIdsSet.forEach((siteId) => siteSet.add(siteId));
      });
    } else {
      (serviceIds || []).forEach((serviceId) => {
        relations.serviceToSites
          .get(serviceId)
          ?.forEach((siteId) => siteSet.add(siteId));
      });
    }

    if (companyIds.length > 0) {
      Array.from(siteSet).forEach((siteId) => {
        const relatedCompanies = relations.siteToCompanies.get(siteId);
        const hasMatchingCompany =
          relatedCompanies &&
          companyIds.some((companyId) => relatedCompanies.has(companyId));

        if (!hasMatchingCompany) {
          siteSet.delete(siteId);
        }
      });
    }

    return this.getSortedOverviewFilterSitesDto(
      items,
      siteMasterList,
      siteSet,
      serviceIds,
      companyIds,
    );
  }

  private getRelatedCompanyIdsForSitesAndServices(
    siteIds: number[],
    filterServices: number[],
    companyMap: Map<number, string>,
    relations?: ReturnType<
      typeof OverviewListMapperService.buildEntityRelations
    >,
  ): SharedSelectMultipleDatum<number>[] {
    if (
      !relations ||
      !relations.siteToCompanies ||
      !relations.companyToServices
    ) {
      return [];
    }

    const companySet = new Set<number>();

    if (!siteIds || siteIds.length === 0) {
      Array.from(companyMap.keys()).forEach((id) => companySet.add(id));
    } else {
      (siteIds || []).forEach((siteId) => {
        relations.siteToCompanies
          .get(siteId)
          ?.forEach((companyId) => companySet.add(companyId));
      });
    }

    if (filterServices.length > 0) {
      Array.from(companySet).forEach((companyId) => {
        const relatedServices = relations.companyToServices.get(companyId);
        const hasMatchingService =
          relatedServices &&
          filterServices.some((serviceId) => relatedServices.has(serviceId));

        if (!hasMatchingService) {
          companySet.delete(companyId);
        }
      });
    }

    const dataCompanies = this.mapCompanySetToDataCompanies(
      companySet,
      companyMap,
    );

    return dataCompanies;
  }

  private getRelatedServiceIdsForSitesAndCompanies(
    siteIds: number[],
    filterCompanies: number[],
    serviceMap: Map<number, string>,
    relations?: ReturnType<
      typeof OverviewListMapperService.buildEntityRelations
    >,
  ): SharedSelectMultipleDatum<number>[] {
    if (
      !relations ||
      !relations.siteToServices ||
      !relations.companyToServices
    ) {
      return [];
    }

    const serviceSet = new Set<number>();

    if (!siteIds || siteIds.length === 0) {
      Array.from(serviceMap.keys()).forEach((id) => serviceSet.add(id));
    } else {
      (siteIds || []).forEach((siteId) => {
        relations.siteToServices
          .get(siteId)
          ?.forEach((serviceId) => serviceSet.add(serviceId));
      });
    }

    if (filterCompanies.length > 0) {
      Array.from(serviceSet).forEach((serviceId) => {
        const relatedCompanies = relations.serviceToCompanies.get(serviceId);
        const hasMatchingCompany =
          relatedCompanies &&
          filterCompanies.some((companyId) => relatedCompanies.has(companyId));

        if (!hasMatchingCompany) {
          serviceSet.delete(serviceId);
        }
      });
    }

    return this.mapServiceSetToDataServices(serviceSet, serviceMap);
  }

  private mapCompanySetToDataCompanies(
    companySet: Set<number>,
    companyMap: Map<number, string>,
  ): SharedSelectMultipleDatum<number>[] {
    return Array.from(companySet)
      .map((id) => {
        const company = companyMap.get(id);
        if (!company) return null;

        return {
          label: company,
          value: id,
        } as SharedSelectMultipleDatum<number>;
      })
      .filter(
        (item): item is SharedSelectMultipleDatum<number> => item !== null,
      );
  }

  private mapServiceSetToDataServices(
    serviceSet: Set<number>,
    serviceMap: Map<number, string>,
  ): SharedSelectMultipleDatum<number>[] {
    return Array.from(serviceSet)
      .map((id) => {
        const service = serviceMap.get(id);
        if (!service) return null;

        return {
          label: service,
          value: id,
        } as SharedSelectMultipleDatum<number>;
      })
      .filter(
        (item): item is SharedSelectMultipleDatum<number> => item !== null,
      );
  }

  private getSortedOverviewFilterSitesDto(
    items: OverviewCompanyServiceSiteFilterResponse[],
    siteMasterList: SiteMasterListItemModel[],
    siteSet: Set<number>,
    serviceIds: number[],
    companyIds: number[],
  ): CustomTreeNode[] {
    const filteredSiteMasterList = siteMasterList.filter((site) =>
      siteSet.has(site.id),
    );
    const filteredOverviewResponse = items.filter(
      (item) =>
        (!serviceIds.length || serviceIds.includes(item.serviceId)) &&
        (!companyIds.length || companyIds.includes(item.companyId)) &&
        siteSet.has(item.siteId),
    );

    const sitesDto = OverviewListMapperService.buildOverviewFiltersSitesData(
      filteredOverviewResponse,
      filteredSiteMasterList,
    );
    const sortedSitesDto = [...sitesDto].sort((a, b) =>
      a.label.localeCompare(b.label),
    );

    return OverviewListMapperService.mapToOverviewFilterSites(sortedSitesDto);
  }

  private prune<T>(data: { value: T }[], originalFilter: T[] = []): T[] {
    const available = data.map((d) => d.value);
    const filtered = (originalFilter || []).filter((f) =>
      available.includes(f),
    );

    return filtered;
  }

  private patchAndGetState(
    ctx: StateContext<OverviewListStateModel>,
    patch: Partial<OverviewListStateModel>,
  ): OverviewListStateModel {
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

  private generateCardNavigationFilters(
    payload: CardNavigationPayload,
    state: OverviewListStateModel,
  ): FilterValue[] {
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();
    const { entity, service, year } = payload;
    const dateMap: Record<string, string> = {
      findings: 'openDate',
      certificates: 'issuedDate',
    };
    const filterColumnMappings: Required<DrillDownFilterColumnMapping> = {
      date: dateMap[entity] ?? 'startDate',
      services: entity === 'findings' ? 'services' : 'service',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
      status: 'status',
    };

    const serviceFilter = formatFilter(
      [service],
      filterColumnMappings.services,
    );

    const statusesMap: Record<string, string> = {
      audit: 'Completed',
      schedule: 'Confirmed',
      findings: 'Closed',
      certificates: 'Issued',
    };

    const statusFilter = formatFilter(
      [statusesMap[entity]],
      filterColumnMappings.status,
    );

    const { firstDay, lastDay } = getYearBoundsAsDates(year);

    const dateFilter = formatFilter(
      [firstDay, lastDay],
      filterColumnMappings.date,
    );

    const { dataCompanies, filterCompanies, filterSites } = state;

    const companyFilters = extractAppliedFilters(
      dataCompanies,
      filterCompanies,
      filterColumnMappings.companyName,
    );

    const { cityNames, siteNames } = this.getCitiesAndSitesFromFilterSites(
      filterSites,
      siteMasterList,
    );

    const citiesFilters = formatFilter(cityNames, filterColumnMappings.cities);

    const siteFilters = formatFilter(siteNames, filterColumnMappings.sites);

    return [
      ...serviceFilter,
      ...statusFilter,
      ...dateFilter,
      ...companyFilters,
      ...citiesFilters,
      ...siteFilters,
    ];
  }

  private getCitiesAndSitesFromFilterSites(
    filterSites: number[],
    siteMasterList: SiteMasterListItemModel[],
  ): { cityNames: string[]; siteNames: string[] } {
    const filteredSites = siteMasterList.filter((site) =>
      filterSites.includes(site.id),
    );
    const cityNames = Array.from(
      new Set(filteredSites.map((site) => site.city).filter((name) => !!name)),
    );
    const siteNames = Array.from(
      new Set(
        filteredSites.map((site) => site.siteName).filter((name) => !!name),
      ),
    );

    return { cityNames, siteNames };
  }
}
