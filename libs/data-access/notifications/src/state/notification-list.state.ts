import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { catchError, EMPTY, of, tap } from 'rxjs';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { DEFAULT_GRID_CONFIG, Routes } from '@customer-portal/shared/constants';
import {
  constructNavigation,
} from '@customer-portal/shared/helpers';
import { SharedSelectTreeChangeEventOutput } from '@customer-portal/shared/models';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import {
  FilterOptions,
  FilterValue,
  GridConfig,
} from '@customer-portal/shared/models/grid';

import { NotificationFilterKey } from '../constants';
import {
  NotificationListDto,
  NotificationResponseFilterDto,
  NotificationSitesFilterDto,
} from '../dtos';
import { NotificationModel } from '../models';
import {
  NotificationFilterMapperService,
  NotificationListService,
  NotificationsListMapperService,
} from '../services';
import {
  ClearNotificationFilter,
  LoadNotificationFilterCategories,
  LoadNotificationFilterCategoriesSuccess,
  LoadNotificationFilterCompanies,
  LoadNotificationFilterCompaniesSuccess,
  LoadNotificationFilterList,
  LoadNotificationFilterServices,
  LoadNotificationFilterServicesSuccess,
  LoadNotificationFilterSites,
  LoadNotificationFilterSitesSuccess,
  LoadNotificationsList,
  LoadUnreadNotifications,
  MarkNotificationAsRead,
  NavigateFromNotification,
  NavigateFromNotificationsListAction,
  NavigateFromNotificationsListToContractsListView,
  NavigateFromNotificationsListToFinancialsListView,
  NavigateFromNotificationsListToScheduleListView,
  UpdateGridConfig,
  UpdateNotificationFilterByKey,
  UpdateNotificationFilterCategories,
  UpdateNotificationFilterCompanies,
  UpdateNotificationFilterServices,
  UpdateNotificationFilterSites,
  UpdateNotifications,
} from './actions';

export interface NotificationsListStateModel {
  notifications: NotificationModel[];
  category: string[];
  company: string[];
  service: string[];
  site: string[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
  isPreferenceSet: boolean;
  categoryFilter: SharedSelectMultipleDatum<number>[];
  serviceFilter: SharedSelectMultipleDatum<number>[];
  companyFilter: SharedSelectMultipleDatum<number>[];
  siteFilter: TreeNode[];
  dataSites: TreeNode[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataCategories: SharedSelectMultipleDatum<number>[];
  selectedCategoryList: number[];
  selectedServiceList: number[];
  selectedCompanyList: number[];
  selectedSiteList: number[];
  isFilterApplied: boolean;
  isLoading: boolean;
  error: string | null;
}

const defaultState: NotificationsListStateModel = {
  notifications: [],
  category: [],
  company: [],
  service: [],
  site: [],
  pageNumber: 1,
  pageSize: 10,
  totalItems: 0,
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
  isPreferenceSet: false,
  categoryFilter: [],
  serviceFilter: [],
  companyFilter: [],
  siteFilter: [],
  dataSites: [],
  dataCompanies: [],
  dataServices: [],
  dataCategories: [],
  selectedCategoryList: [],
  selectedServiceList: [],
  selectedCompanyList: [],
  selectedSiteList: [],
  isFilterApplied: false,
  isLoading: false,
  error: null,
};

@State<NotificationsListStateModel>({
  name: 'notificationList',
  defaults: defaultState,
})
@Injectable()
export class NotificationListState {
  constructor(
    private notificationListService: NotificationListService,
    private domSanitizer: DomSanitizer,
  ) {}

  @Action(LoadNotificationsList, { cancelUncompleted: true })
  loadNotificationList(ctx: StateContext<NotificationsListStateModel>) {
    ctx.patchState({
      isLoading: true,
      notifications: [],
      error: '',
    });
    const state = ctx.getState();
    const {
      pageSize,
      gridConfig,
      selectedCategoryList,
      selectedServiceList,
      selectedCompanyList,
      selectedSiteList,
      isFilterApplied,
    } = state;

    const gridConfigPageSize = gridConfig.pagination.pageSize;
    const gridConfigStartIndex = gridConfig.pagination.startIndex;
    const currentpageSize =
      pageSize !== gridConfigPageSize ? gridConfigPageSize : pageSize;

    let currentPageNumber = 1;

    if (isFilterApplied) {
      ctx.patchState({ isFilterApplied: false });
    } else {
      currentPageNumber =
        Math.ceil(gridConfigStartIndex / gridConfigPageSize) + 1;
    }

    return this.notificationListService
      .getNotificationList(
        selectedCategoryList,
        selectedCompanyList,
        selectedServiceList,
        selectedSiteList,
        currentPageNumber,
        currentpageSize,
      )
      .pipe(
        throwIfNotSuccess(),
        tap((notificationsList: NotificationListDto) => {
          const notifications =
            NotificationsListMapperService.mapToNotificationsListModel(
              notificationsList,
              this.domSanitizer,
            );

          const { totalItems } = notificationsList.data;
          ctx.patchState({
            notifications,
            totalItems,
            isLoading: false,
            error: '',
          });
        }),
        catchError(() => {
          ctx.patchState({
            notifications: [],
            totalItems: 0,
            isLoading: false,
            error: 'Failed to load notification data',
          });

          return EMPTY;
        }),
      );
  }

  @Action(MarkNotificationAsRead)
  markNotificationAsRead(
    ctx: StateContext<NotificationsListStateModel>,
    action: MarkNotificationAsRead,
  ) {
    return this.notificationListService.updateNotification(action.id).pipe(
      tap((isSuccess) => {
        if (isSuccess) {
          const state = ctx.getState();
          const updatedNotifications: NotificationModel[] =
            state.notifications.map((notification: NotificationModel) => {
              if (notification.id === action.id) {
                return {
                  ...notification,
                  isRead: true,
                  iconTooltip: {
                    ...notification.iconTooltip,
                    displayIcon: false,
                  },
                };
              }

              return notification;
            });
          ctx.dispatch(new LoadUnreadNotifications());

          ctx.patchState({
            ...state,
            notifications: updatedNotifications,
          });
        }
      }),
      catchError(() => {
        ctx.patchState({ notifications: [] });

        return of([]);
      }),
    );
  }

  @Action(UpdateNotifications)
  updateNotifications(
    ctx: StateContext<NotificationsListStateModel>,
    action: UpdateNotifications,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      notifications: action.notifications,
    });
  }

  @Action(NavigateFromNotification)
  navigateFromNotification(
    ctx: StateContext<NotificationsListStateModel>,
    action: NavigateFromNotification,
  ): void {
    const { url, parameters, filters } = constructNavigation(
      action.id,
      action.type as keyof Routes,
    );

    const actionsMap: Record<
      string,
      new (
        notificationsFilters: FilterValue[],
      ) => NavigateFromNotificationsListAction
    > = {
      contracts: NavigateFromNotificationsListToContractsListView,
      financials: NavigateFromNotificationsListToFinancialsListView,
      scheduleList: NavigateFromNotificationsListToScheduleListView,
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

  @Action(UpdateGridConfig)
  updateGridConfig(
    ctx: StateContext<NotificationsListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new LoadNotificationsList());
  }

  @Action(LoadNotificationFilterList, { cancelUncompleted: true })
  loadNotificationFilterList(ctx: StateContext<NotificationsListStateModel>) {
    ctx.dispatch([
      new LoadNotificationFilterCategories(),
      new LoadNotificationFilterServices(),
      new LoadNotificationFilterCompanies(),
      new LoadNotificationFilterSites(),
    ]);
  }

  @Action(UpdateNotificationFilterServices)
  updateNotificationFilterServices(
    ctx: StateContext<NotificationsListStateModel>,
    { data }: UpdateNotificationFilterServices,
  ) {
    ctx.patchState({
      selectedServiceList: data,
    });
  }

  @Action(LoadNotificationFilterServices, { cancelUncompleted: true })
  loadNotificationFilterServices(
    ctx: StateContext<NotificationsListStateModel>,
  ) {
    const { selectedCategoryList, selectedCompanyList, selectedSiteList } =
      ctx.getState();

    return this.notificationListService
      .getNotificationServices(
        selectedCategoryList,
        selectedCompanyList,
        selectedSiteList,
      )
      .pipe(
        tap((response: NotificationResponseFilterDto) => {
          ctx.dispatch(
            new LoadNotificationFilterServicesSuccess(
              NotificationFilterMapperService.mapToNotificationFilter(
                response.data,
              ),
            ),
          );
        }),
      );
  }

  @Action(LoadNotificationFilterServicesSuccess)
  loadNotificationFilterServicesSuccess(
    ctx: StateContext<NotificationsListStateModel>,
    { dataServices }: LoadNotificationFilterServicesSuccess,
  ) {
    ctx.patchState({
      dataServices,
    });
  }

  @Action(UpdateNotificationFilterCategories)
  updateNotificationFilterCategories(
    ctx: StateContext<NotificationsListStateModel>,
    { data }: UpdateNotificationFilterCategories,
  ) {
    ctx.patchState({
      selectedCategoryList: data,
    });
  }

  @Action(LoadNotificationFilterCategories, { cancelUncompleted: true })
  loadNotificationFilterCategories(
    ctx: StateContext<NotificationsListStateModel>,
  ) {
    const { selectedCompanyList, selectedServiceList, selectedSiteList } =
      ctx.getState();

    return this.notificationListService
      .getNotificationCategory(
        selectedCompanyList,
        selectedServiceList,
        selectedSiteList,
      )
      .pipe(
        tap((response: NotificationResponseFilterDto) => {
          ctx.dispatch(
            new LoadNotificationFilterCategoriesSuccess(
              NotificationFilterMapperService.mapToNotificationFilter(
                response.data,
              ),
            ),
          );
        }),
      );
  }

  @Action(LoadNotificationFilterCategoriesSuccess)
  loadNotificationFilterCategoriesSuccess(
    ctx: StateContext<NotificationsListStateModel>,
    { dataCategories }: LoadNotificationFilterCategoriesSuccess,
  ) {
    ctx.patchState({
      dataCategories,
    });
  }

  @Action(UpdateNotificationFilterCompanies)
  updateNotificationFilterCompanies(
    ctx: StateContext<NotificationsListStateModel>,
    { data }: UpdateNotificationFilterCompanies,
  ) {
    ctx.patchState({
      selectedCompanyList: data,
    });
  }

  @Action(LoadNotificationFilterCompanies, { cancelUncompleted: true })
  loadNotificationFilterCompanies(
    ctx: StateContext<NotificationsListStateModel>,
  ) {
    const { selectedCategoryList, selectedServiceList, selectedSiteList } =
      ctx.getState();

    return this.notificationListService
      .getNotificationCompany(
        selectedCategoryList,
        selectedServiceList,
        selectedSiteList,
      )
      .pipe(
        tap((response: NotificationResponseFilterDto) => {
          ctx.dispatch(
            new LoadNotificationFilterCompaniesSuccess(
              NotificationFilterMapperService.mapToNotificationFilter(
                response.data,
              ),
            ),
          );
        }),
      );
  }

  @Action(LoadNotificationFilterCompaniesSuccess)
  loadNotificationFilterCompaniesSuccess(
    ctx: StateContext<NotificationsListStateModel>,
    { dataCompanies }: LoadNotificationFilterCompaniesSuccess,
  ) {
    ctx.patchState({
      dataCompanies,
    });
  }

  @Action(UpdateNotificationFilterSites)
  updateNotificationFilterSites(
    ctx: StateContext<NotificationsListStateModel>,
    { data }: UpdateNotificationFilterSites,
  ) {
    ctx.patchState({
      selectedSiteList: data.filter,
    });
  }

  @Action(LoadNotificationFilterSites, { cancelUncompleted: true })
  loadNotificationFilterSites(ctx: StateContext<NotificationsListStateModel>) {
    const { selectedCategoryList, selectedCompanyList, selectedServiceList } =
      ctx.getState();

    return this.notificationListService
      .getNotificationSites(
        selectedCompanyList,
        selectedCategoryList,
        selectedServiceList,
      )
      .pipe(
        tap((response: NotificationSitesFilterDto) => {
          ctx.dispatch(
            new LoadNotificationFilterSitesSuccess(
              NotificationFilterMapperService.mapToNotificationSitesFilter(
                response.data,
              ),
            ),
          );
        }),
      );
  }

  @Action(LoadNotificationFilterSitesSuccess)
  loadNotificationFilterSitesSuccess(
    ctx: StateContext<NotificationsListStateModel>,
    { dataSites }: LoadNotificationFilterSitesSuccess,
  ) {
    ctx.patchState({
      dataSites,
    });
  }

  @Action(UpdateNotificationFilterByKey)
  updateNotificationFilterByKey(
    ctx: StateContext<NotificationsListStateModel>,
    { data, key }: UpdateNotificationFilterByKey,
  ) {
    const actionsMap = {
      [NotificationFilterKey.Categories]: [
        new UpdateNotificationFilterCategories(data as number[]),
        new LoadNotificationFilterServices(),
        new LoadNotificationFilterCompanies(),
        new LoadNotificationFilterSites(),
        new LoadNotificationsList(),
      ],
      [NotificationFilterKey.Services]: [
        new UpdateNotificationFilterServices(data as number[]),
        new LoadNotificationFilterCategories(),
        new LoadNotificationFilterCompanies(),
        new LoadNotificationFilterSites(),
        new LoadNotificationsList(),
      ],
      [NotificationFilterKey.Companies]: [
        new UpdateNotificationFilterCompanies(data as number[]),
        new LoadNotificationFilterCategories(),
        new LoadNotificationFilterServices(),
        new LoadNotificationFilterSites(),
        new LoadNotificationsList(),
      ],
      [NotificationFilterKey.Sites]: [
        new UpdateNotificationFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
        new LoadNotificationFilterCategories(),
        new LoadNotificationFilterServices(),
        new LoadNotificationFilterCompanies(),
        new LoadNotificationsList(),
      ],
    };
    ctx.dispatch(actionsMap[key]);

    const hasValues = (mapAction: { [key: string]: any[] }) =>
      Object.values(mapAction).some((array) =>
        array.some((item) => {
          if (
            item instanceof UpdateNotificationFilterCategories ||
            item instanceof UpdateNotificationFilterServices ||
            item instanceof UpdateNotificationFilterCompanies
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

  @Action(ClearNotificationFilter)
  clearNotificationFilter(ctx: StateContext<NotificationsListStateModel>) {
    ctx.patchState({
      selectedCategoryList: [],
      selectedCompanyList: [],
      selectedServiceList: [],
      selectedSiteList: [],
    });
  }
}
