import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { tap } from 'rxjs';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { DEFAULT_GRID_CONFIG, Routes } from '@customer-portal/shared/constants';
import { constructNavigation } from '@customer-portal/shared/helpers/navigation';
import {
  FilterValue,
  GridConfig,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { ActionFilterKey } from '../constants';
import {
  ActionFilterResponseDto,
  ActionSitesFilterDto,
  ActionsListDto,
} from '../dtos';
import { ActionsFilterModel, ActionsModel } from '../models';
import {
  ActionFilterMapperService,
  ActionsFilterService,
  ActionsListMapperService,
  ActionsListService,
} from '../services';
import {
  ClearActionFilter,
  LoadActionFilterCategories,
  LoadActionFilterCategoriesSuccess,
  LoadActionFilterCompanies,
  LoadActionFilterCompaniesSuccess,
  LoadActionFilterServices,
  LoadActionFilterServicesSuccess,
  LoadActionFilterSites,
  LoadActionFilterSitesSuccess,
  LoadActionsDetails,
  LoadActionsFilterList,
  LoadHighPriorityAction,
  NavigateFromAction,
  NavigateFromActionsListAction,
  NavigateFromActionsListToScheduleListView,
  UpdateActionFilterByKey,
  UpdateActionFilterCategories,
  UpdateActionFilterCompanies,
  UpdateActionFilterServices,
  UpdateActionFilterSites,
  UpdateGridConfig,
} from './actions';

export interface ActionsListStateModel {
  actions: ActionsModel[];
  categoryFilter: SharedSelectMultipleDatum<number>[];
  serviceFilter: SharedSelectMultipleDatum<number>[];
  companyFilter: SharedSelectMultipleDatum<number>[];
  siteFilter: TreeNode[];
  isPreferenceSet: boolean;
  selectedCategories: number[];
  selectedServices: number[];
  selectedCompanies: number[];
  selectedSites: number[];
  dataSites: TreeNode[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataCategories: SharedSelectMultipleDatum<number>[];
  gridConfig: GridConfig;
  isHighPriority: boolean;
  pageSize: number;
  totalItems: number;
  isFilterApplied: boolean;
}

const defaultState: ActionsListStateModel = {
  actions: [
    {
      id: 1,
      actionName: '',
      dueDate: '',
      message: '',
      service: '',
      site: '',
      highPriority: false,
      entityType: '',
      entityId: '',
      actions: [
        {
          actionType: '',
          iconClass: '',
          label: '',
          url: '',
        },
      ],
      dateWithIcon: {
        displayIcon: false,
        iconClass: '',
        tooltipMessage: '',
        iconPosition: '',
      },
      iconTooltip: {
        displayIcon: false,
        iconClass: '',
        tooltipMessage: '',
        iconPosition: '',
      },
    },
  ],
  categoryFilter: [],
  serviceFilter: [],
  companyFilter: [],
  siteFilter: [],
  dataSites: [],
  dataCompanies: [],
  dataServices: [],
  dataCategories: [],
  isPreferenceSet: false,
  selectedCategories: [],
  selectedServices: [],
  selectedCompanies: [],
  selectedSites: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  isHighPriority: false,
  pageSize: 10,
  totalItems: 0,
  isFilterApplied: false,
};

@State<ActionsListStateModel>({
  name: 'actionsDetails',
  defaults: defaultState,
})
@Injectable()
export class ActionsListState {
  constructor(
    private actionsListService: ActionsListService,
    private actionsFilterService: ActionsFilterService,
    private domSanitizer: DomSanitizer,
  ) {}

  @Action(LoadActionsDetails, { cancelUncompleted: true })
  loadActionsDetails(ctx: StateContext<ActionsListStateModel>) {
    const state = ctx.getState();
    const {
      pageSize,
      gridConfig,
      selectedCategories,
      selectedServices,
      selectedCompanies,
      selectedSites,
      isHighPriority,
      isFilterApplied,
    } = state;

    const { pageSize: gridConfigPageSize, startIndex } = gridConfig.pagination;

    const currentPageSize =
      pageSize !== gridConfigPageSize ? gridConfigPageSize : pageSize;

    let currentPageNumber = 1;

    if (isFilterApplied) {
      ctx.patchState({ isFilterApplied: false });
    } else {
      currentPageNumber = Math.ceil(startIndex / gridConfigPageSize) + 1;
    }

    return this.actionsListService
      .getActionsList(
        selectedCategories,
        selectedCompanies,
        selectedServices,
        selectedSites,
        isHighPriority,
        currentPageNumber,
        currentPageSize,
      )
      .pipe(
        tap((actionsList: ActionsListDto) => {
          if (actionsList) {
            const actions = ActionsListMapperService.mapToActionsListItemModel(
              actionsList,
              this.domSanitizer,
            );

            const { totalItems } = actionsList;
            ctx.patchState({ actions, totalItems });
          } else {
            ctx.patchState({ actions: [], totalItems: 0 });
          }
        }),
      );
  }

  @Action(UpdateGridConfig)
  updateGridConfig(
    ctx: StateContext<ActionsListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new LoadActionsDetails());
  }

  @Action(LoadHighPriorityAction)
  loadHighPriorityAction(
    ctx: StateContext<ActionsListStateModel>,
    { isHighPriority }: LoadHighPriorityAction,
  ) {
    ctx.patchState({ isHighPriority });

    return ctx.dispatch(new LoadActionsDetails());
  }

  @Action(LoadActionsFilterList)
  loadActionsFilterList(ctx: StateContext<ActionsFilterModel>) {
    ctx.dispatch([
      new LoadActionFilterCategories(),
      new LoadActionFilterServices(),
      new LoadActionFilterCompanies(),
      new LoadActionFilterSites(),
    ]);
  }

  @Action(UpdateActionFilterCategories)
  updateActionFilterCategories(
    ctx: StateContext<ActionsListStateModel>,
    { data }: UpdateActionFilterCategories,
  ) {
    ctx.patchState({
      selectedCategories: data,
    });
  }

  @Action(LoadActionFilterCategories)
  loadActionFilterCategories(ctx: StateContext<ActionsListStateModel>) {
    const { selectedCompanies, selectedServices, selectedSites } =
      ctx.getState();

    return this.actionsFilterService
      .getActionFilterCategories(
        selectedCompanies,
        selectedServices,
        selectedSites,
      )
      .pipe(
        tap((response: ActionFilterResponseDto) => {
          ctx.dispatch(
            new LoadActionFilterCategoriesSuccess(
              ActionFilterMapperService.mapToActionFilter(response?.data),
            ),
          );
        }),
      );
  }

  @Action(LoadActionFilterCategoriesSuccess)
  loadActionFilterCategoriesSuccess(
    ctx: StateContext<ActionsListStateModel>,
    { dataCategories }: LoadActionFilterCategoriesSuccess,
  ) {
    ctx.patchState({
      dataCategories,
    });
  }

  @Action(UpdateActionFilterServices)
  updateActionFilterServices(
    ctx: StateContext<ActionsListStateModel>,
    { data }: UpdateActionFilterServices,
  ) {
    ctx.patchState({
      selectedServices: data,
    });
  }

  @Action(LoadActionFilterServices)
  loadActionFilterServices(ctx: StateContext<ActionsListStateModel>) {
    const { selectedCompanies, selectedCategories, selectedSites } =
      ctx.getState();

    return this.actionsFilterService
      .getActionFilterServices(
        selectedCompanies,
        selectedCategories,
        selectedSites,
      )
      .pipe(
        tap((response: ActionFilterResponseDto) => {
          ctx.dispatch(
            new LoadActionFilterServicesSuccess(
              ActionFilterMapperService.mapToActionFilter(response?.data),
            ),
          );
        }),
      );
  }

  @Action(LoadActionFilterServicesSuccess)
  loadActionFilterServicesSuccess(
    ctx: StateContext<ActionsListStateModel>,
    { dataServices }: LoadActionFilterServicesSuccess,
  ) {
    ctx.patchState({
      dataServices,
    });
  }

  @Action(UpdateActionFilterCompanies)
  updateActionFilterCompanies(
    ctx: StateContext<ActionsListStateModel>,
    { data }: UpdateActionFilterCompanies,
  ) {
    ctx.patchState({
      selectedCompanies: data,
    });
  }

  @Action(LoadActionFilterCompanies)
  loadActionFilterCompanies(ctx: StateContext<ActionsListStateModel>) {
    const { selectedCategories, selectedServices, selectedSites } =
      ctx.getState();

    return this.actionsFilterService
      .getActionFilterCompanies(
        selectedCategories,
        selectedServices,
        selectedSites,
      )
      .pipe(
        tap((response: ActionFilterResponseDto) => {
          ctx.dispatch(
            new LoadActionFilterCompaniesSuccess(
              ActionFilterMapperService.mapToActionFilter(response?.data),
            ),
          );
        }),
      );
  }

  @Action(LoadActionFilterCompaniesSuccess)
  loadActionFilterCompaniesSuccess(
    ctx: StateContext<ActionsListStateModel>,
    { dataCompanies }: LoadActionFilterCompaniesSuccess,
  ) {
    ctx.patchState({
      dataCompanies,
    });
  }

  @Action(UpdateActionFilterSites)
  updateActionFilterSites(
    ctx: StateContext<ActionsListStateModel>,
    { data }: UpdateActionFilterSites,
  ) {
    ctx.patchState({
      selectedSites: data.filter,
    });
  }

  @Action(LoadActionFilterSites)
  loadActionFilterSites(ctx: StateContext<ActionsListStateModel>) {
    const { selectedCompanies, selectedCategories, selectedServices } =
      ctx.getState();

    return this.actionsFilterService
      .getActionFilterSites(
        selectedCompanies,
        selectedCategories,
        selectedServices,
      )
      .pipe(
        tap((response: ActionSitesFilterDto) => {
          ctx.dispatch(
            new LoadActionFilterSitesSuccess(
              ActionFilterMapperService.mapToActionSitesFilter(response?.data),
            ),
          );
        }),
      );
  }

  @Action(LoadActionFilterSitesSuccess)
  loadActionFilterSitesSuccess(
    ctx: StateContext<ActionsListStateModel>,
    { dataSites }: LoadActionFilterSitesSuccess,
  ) {
    ctx.patchState({
      dataSites,
    });
  }

  @Action(UpdateActionFilterByKey)
  updateActionFilterByKey(
    ctx: StateContext<ActionsListStateModel>,
    { data, key }: UpdateActionFilterByKey,
  ) {
    const actionsMap = {
      [ActionFilterKey.Categories]: [
        new UpdateActionFilterCategories(data as number[]),
        new LoadActionFilterServices(),
        new LoadActionFilterCompanies(),
        new LoadActionFilterSites(),
        new LoadActionsDetails(),
      ],
      [ActionFilterKey.Services]: [
        new UpdateActionFilterServices(data as number[]),
        new LoadActionFilterCategories(),
        new LoadActionFilterCompanies(),
        new LoadActionFilterSites(),
        new LoadActionsDetails(),
      ],
      [ActionFilterKey.Companies]: [
        new UpdateActionFilterCompanies(data as number[]),
        new LoadActionFilterCategories(),
        new LoadActionFilterServices(),
        new LoadActionFilterSites(),
        new LoadActionsDetails(),
      ],
      [ActionFilterKey.Sites]: [
        new UpdateActionFilterSites(data as SharedSelectTreeChangeEventOutput),
        new LoadActionFilterCategories(),
        new LoadActionFilterServices(),
        new LoadActionFilterCompanies(),
        new LoadActionsDetails(),
      ],
    };
    ctx.dispatch(actionsMap[key]);

    const hasValues = (map: { [key: string]: any[] }) =>
      Object.values(map).some((array) =>
        array.some((item) => {
          if (
            item instanceof UpdateActionFilterCategories ||
            item instanceof UpdateActionFilterServices ||
            item instanceof UpdateActionFilterCompanies
          ) {
            return item.data.length > 0;
          }

          return false;
        }),
      );

    if (hasValues(actionsMap)) {
      ctx.patchState({ isFilterApplied: true });
    } else {
      ctx.patchState({ isFilterApplied: false });
    }
  }

  @Action(NavigateFromAction)
  navigateFromAction(
    ctx: StateContext<ActionsListStateModel>,
    action: NavigateFromAction,
  ): void {
    const { url, parameters, filters } = constructNavigation(
      action.id,
      action.type as keyof Routes,
    );

    const actionsMap: Record<
      string,
      new (notificationsFilters: FilterValue[]) => NavigateFromActionsListAction
    > = {
      scheduleList: NavigateFromActionsListToScheduleListView,
    };

    const NavigationAction = actionsMap[action.type];

    if (filters && actionsMap[action.type]) {
      ctx.dispatch([
        new Navigate([url], parameters),
        new NavigationAction(filters),
      ]);

      return;
    }

    ctx.dispatch([new Navigate([url], parameters)]);
  }

  @Action(ClearActionFilter)
  clearActionFilter(ctx: StateContext<ActionsListStateModel>) {
    ctx.patchState({
      selectedCategories: [],
      selectedCompanies: [],
      selectedServices: [],
      selectedSites: [],
    });
  }
}
