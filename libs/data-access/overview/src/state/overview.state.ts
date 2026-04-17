import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { map, tap } from 'rxjs';

import {
  NavigateFromOverviewCardAction,
  NavigateFromOverviewCardToAuditListView,
  NavigateFromOverviewCardToFindingsListView,
  NavigateFromOverviewCardToScheduleListView,
} from '@customer-portal/overview-shared';
import {
  CardDataModel,
  CardNavigationPayload,
  DrillDownFilterColumnMapping,
  extractAppliedFilters,
  extractLocationChartFilters,
  FilterValue,
  formatFilter,
  getYearBoundsAsDates,
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { OverviewFilterTypes } from '../constants';
import { OverviewFilterDto } from '../dtos';
import { OverviewCardPageInfoModel } from '../models';
import {
  OverviewFilterMapperService,
  OverviewFilterService,
  OverviewMapperService,
  OverviewService,
} from '../services';
import {
  LoadMoreOverviewCardData,
  LoadOverviewCardData,
  LoadOverviewCardDataSuccess,
  LoadOverviewFilterCompanies,
  LoadOverviewFilterCompaniesSuccess,
  LoadOverviewFilterList,
  LoadOverviewFilterServices,
  LoadOverviewFilterServicesSuccess,
  LoadOverviewFilterSites,
  LoadOverviewFilterSitesSuccess,
  NavigateFromOverviewCardToListView,
  ResetOverviewState,
  UpdateOverviewFilterByKey,
  UpdateOverviewFilterCompanies,
  UpdateOverviewFilterServices,
  UpdateOverviewFilterSites,
} from './actions';

export interface OverviewStateModel {
  filterCompanies: number[];
  filterServices: number[];
  filterSites: number[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataSites: TreeNode[];
  overviewCardData: CardDataModel[];
  prefillCompanies: number[];
  prefillServices: number[];
  prefillSites: TreeNode[];
  pageInfo: OverviewCardPageInfoModel;
}

const defaultState: OverviewStateModel = {
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  overviewCardData: [],
  prefillCompanies: [],
  prefillServices: [],
  prefillSites: [],
  pageInfo: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
  },
};

@State<OverviewStateModel>({
  name: 'overview',
  defaults: defaultState,
})
@Injectable()
export class OverviewState {
  constructor(
    private readonly overviewFilterService: OverviewFilterService,
    private readonly overviewService: OverviewService,
  ) {}

  // #region Overview
  @Action(LoadOverviewCardData)
  loadOverviewCardData(
    ctx: StateContext<OverviewStateModel>,
    { shouldKeepPreviousData }: LoadOverviewCardData,
  ) {
    const { pageInfo, filterCompanies, filterServices, filterSites } =
      ctx.getState();

    return this.overviewService
      .getOverviewCardData(
        pageInfo.currentPage,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((overviewCardsDto) => {
          const overviewCardData =
            OverviewMapperService.mapToOverviewCardModel(overviewCardsDto);
          const pageData =
            OverviewMapperService.mapToPageInfo(overviewCardsDto);

          if (overviewCardData) {
            ctx.dispatch(
              new LoadOverviewCardDataSuccess(
                overviewCardData,
                pageData,
                shouldKeepPreviousData,
              ),
            );
          }
        }),
      );
  }

  @Action(LoadOverviewCardDataSuccess)
  loadOverviewCardDataSuccess(
    ctx: StateContext<OverviewStateModel>,
    {
      overviewCardData,
      pageInfo,
      shouldKeepPreviousData,
    }: LoadOverviewCardDataSuccess,
  ): void {
    let newOverviewCardData = overviewCardData;

    if (shouldKeepPreviousData) {
      const currentOverviewCardData = ctx.getState().overviewCardData;
      newOverviewCardData = [...currentOverviewCardData, ...overviewCardData];
    }

    ctx.patchState({ overviewCardData: newOverviewCardData, pageInfo });
  }

  @Action(LoadMoreOverviewCardData)
  loadMoreOverviewCardData(ctx: StateContext<OverviewStateModel>) {
    const { pageInfo } = ctx.getState();

    ctx.patchState({
      pageInfo: {
        ...pageInfo,
        currentPage: pageInfo.currentPage + 1,
      },
    });

    return ctx.dispatch(new LoadOverviewCardData(true));
  }

  @Action(ResetOverviewState)
  resetOverviewState(ctx: StateContext<OverviewStateModel>) {
    ctx.setState(defaultState);
  }
  // #endregion Overview

  // #region OverviewCardsNavigation
  @Action(NavigateFromOverviewCardToListView)
  navigateFromOverviewCardToListView(
    ctx: StateContext<OverviewStateModel>,
    { payload }: NavigateFromOverviewCardToListView,
  ) {
    const redirectionMap: Record<string, string> = {
      audit: '/audits',
      schedule: '/schedule/list',
      findings: '/findings',
    };

    const actionsMap: Record<
      keyof typeof redirectionMap,
      new (overviewCardFilters: FilterValue[]) => NavigateFromOverviewCardAction
    > = {
      audit: NavigateFromOverviewCardToAuditListView,
      schedule: NavigateFromOverviewCardToScheduleListView,
      findings: NavigateFromOverviewCardToFindingsListView,
    };

    const { entity } = payload;

    const route = redirectionMap[entity];
    const NavigationAction = actionsMap[entity];

    if (!route || !NavigationAction) {
      return;
    }

    const state = ctx.getState();
    const overviewFilters = this.generateCardNavigationFilters(payload, state);

    ctx.dispatch([
      new Navigate([route]),
      new NavigationAction(overviewFilters),
    ]);
  }
  // #endregion OverviewCardsNavigation

  // #region OverviewFilters
  @Action(LoadOverviewFilterList)
  loadOverviewFilterList(ctx: StateContext<OverviewStateModel>) {
    ctx.dispatch([
      new LoadOverviewFilterCompanies(),
      new LoadOverviewFilterServices(),
      new LoadOverviewFilterSites(),
    ]);
  }

  @Action(LoadOverviewFilterCompanies)
  loadOverviewFilterCompanies(ctx: StateContext<OverviewStateModel>) {
    const { filterServices, filterSites } = ctx.getState();

    return this.getOverviewFilterCompanies(filterServices, filterSites).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadOverviewFilterCompaniesSuccess(
            OverviewFilterMapperService.mapToOverviewFilterList(data),
          ),
        );
      }),
    );
  }

  @Action(LoadOverviewFilterCompaniesSuccess)
  loadOverviewFilterCompaniesSuccess(
    ctx: StateContext<OverviewStateModel>,
    { dataCompanies }: LoadOverviewFilterCompaniesSuccess,
  ) {
    ctx.patchState({
      dataCompanies,
    });
  }

  @Action(LoadOverviewFilterServices)
  loadOverviewFilterServices(ctx: StateContext<OverviewStateModel>) {
    const { filterCompanies, filterSites } = ctx.getState();

    return this.getOverviewFilterServices(filterCompanies, filterSites).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadOverviewFilterServicesSuccess(
            OverviewFilterMapperService.mapToOverviewFilterList(data),
          ),
        );
      }),
    );
  }

  @Action(LoadOverviewFilterServicesSuccess)
  loadOverviewFilterServicesSuccess(
    ctx: StateContext<OverviewStateModel>,
    { dataServices }: LoadOverviewFilterServicesSuccess,
  ) {
    ctx.patchState({
      dataServices,
    });
  }

  @Action(LoadOverviewFilterSites)
  loadOverviewFilterSites(ctx: StateContext<OverviewStateModel>) {
    const { filterCompanies, filterServices } = ctx.getState();

    return this.getOverviewFilterSites(filterCompanies, filterServices).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadOverviewFilterSitesSuccess(
            OverviewFilterMapperService.mapToOverviewFilterTree(data),
          ),
        );
      }),
    );
  }

  @Action(LoadOverviewFilterSitesSuccess)
  loadOverviewFilterSitesSuccess(
    ctx: StateContext<OverviewStateModel>,
    { dataSites }: LoadOverviewFilterSitesSuccess,
  ) {
    ctx.patchState({
      dataSites,
    });
  }

  @Action(UpdateOverviewFilterByKey)
  updateOverviewFilterByKey(
    ctx: StateContext<OverviewStateModel>,
    { data, key }: UpdateOverviewFilterByKey,
  ) {
    const actionsMap = {
      [OverviewFilterTypes.Companies]: [
        new UpdateOverviewFilterCompanies(data as number[]),
        new LoadOverviewFilterServices(),
        new LoadOverviewFilterSites(),
        new LoadOverviewCardData(),
      ],
      [OverviewFilterTypes.Services]: [
        new UpdateOverviewFilterServices(data as number[]),
        new LoadOverviewFilterCompanies(),
        new LoadOverviewFilterSites(),
        new LoadOverviewCardData(),
      ],
      [OverviewFilterTypes.Sites]: [
        new UpdateOverviewFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
        new LoadOverviewFilterCompanies(),
        new LoadOverviewFilterServices(),
        new LoadOverviewCardData(),
      ],
    };

    const { pageInfo } = ctx.getState();
    ctx.patchState({
      pageInfo: {
        ...pageInfo,
        currentPage: 1,
      },
    });

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateOverviewFilterCompanies)
  updateOverviewFilterCompanies(
    ctx: StateContext<OverviewStateModel>,
    { data }: UpdateOverviewFilterCompanies,
  ) {
    ctx.patchState({
      filterCompanies: data,
    });
  }

  @Action(UpdateOverviewFilterServices)
  updateOverviewFilterServices(
    ctx: StateContext<OverviewStateModel>,
    { data }: UpdateOverviewFilterServices,
  ) {
    ctx.patchState({
      filterServices: data,
    });
  }

  @Action(UpdateOverviewFilterSites)
  updateOverviewFilterSites(
    ctx: StateContext<OverviewStateModel>,
    { data }: UpdateOverviewFilterSites,
  ) {
    ctx.patchState({
      filterSites: data.filter as number[],
      prefillSites: structuredClone(data.prefill) as TreeNode[],
    });
  }
  // #endregion OverviewFilters

  private getOverviewFilterCompanies(services: number[], sites: number[]) {
    return this.overviewFilterService
      .getOverviewFilterCompanies(services, sites)
      .pipe(
        map((dto: OverviewFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getOverviewFilterServices(companies: number[], sites: number[]) {
    return this.overviewFilterService
      .getOverviewFilterServices(companies, sites)
      .pipe(
        map((dto: OverviewFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getOverviewFilterSites(companies: number[], services: number[]) {
    return this.overviewFilterService
      .getOverviewFilterSites(companies, services)
      .pipe(
        map((dto: OverviewFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private generateCardNavigationFilters(
    payload: CardNavigationPayload,
    state: OverviewStateModel,
  ): FilterValue[] {
    const { entity, service, year } = payload;

    const filterColumnMappings: Required<DrillDownFilterColumnMapping> = {
      date: entity === 'findings' ? 'openDate' : 'startDate',
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

    const { dataCompanies, filterCompanies, prefillSites } = state;

    const companyFilters = extractAppliedFilters(
      dataCompanies,
      filterCompanies,
      filterColumnMappings.companyName,
    );

    const locationFilters = extractLocationChartFilters(prefillSites);

    const citiesFilters = formatFilter(
      locationFilters.cities,
      filterColumnMappings.cities,
    );

    const siteFilters = formatFilter(
      locationFilters.sites,
      filterColumnMappings.sites,
    );

    return [
      ...serviceFilter,
      ...statusFilter,
      ...dateFilter,
      ...companyFilters,
      ...citiesFilters,
      ...siteFilters,
    ];
  }
}
