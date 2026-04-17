import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { SharedSelectTreeChangeEventOutput } from '@customer-portal/shared/models';
import { GridConfig } from '@customer-portal/shared/models/grid';

import { NotificationFilterKey } from '../../constants';
import { NotificationModel } from '../../models';
import {
  ClearNotificationFilter,
  LoadNotificationFilterCategories,
  LoadNotificationFilterCompanies,
  LoadNotificationFilterList,
  LoadNotificationFilterServices,
  LoadNotificationFilterSites,
  LoadNotificationsList,
  MarkNotificationAsRead,
  NavigateFromNotification,
  UpdateGridConfig,
  UpdateNotificationFilterByKey,
  UpdateNotificationFilterCategories,
  UpdateNotificationFilterCompanies,
  UpdateNotificationFilterServices,
  UpdateNotificationFilterSites,
} from '../actions';
import { NotificationListSelectors } from '../selectors/notification-list.selectors';

@Injectable()
export class NotificationListStoreService {
  constructor(private store: Store) {}

  get notificationList(): Signal<NotificationModel[]> {
    return this.store.selectSignal(NotificationListSelectors.getNotifications);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(
      NotificationListSelectors.totalNotificationsRecords,
    );
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(NotificationListSelectors.hasActiveFilters);
  }

  @Dispatch()
  loadNotificationList = () => new LoadNotificationsList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  markNotificationAsRead = (id: number) => new MarkNotificationAsRead(id);

  @Dispatch()
  navigateFromNotification = (id: string, type: string) =>
    new NavigateFromNotification(id, type);

  get notificationCategoryFilter(): Signal<
    SharedSelectMultipleDatum<number>[]
  > {
    return this.store.selectSignal(
      NotificationListSelectors.NotificationCategoryFilter,
    );
  }

  get notificationServicesFilter(): Signal<
    SharedSelectMultipleDatum<number>[]
  > {
    return this.store.selectSignal(
      NotificationListSelectors.NotificationServiceFilter,
    );
  }

  get notificationCompaniesFilter(): Signal<
    SharedSelectMultipleDatum<number>[]
  > {
    return this.store.selectSignal(
      NotificationListSelectors.NotificationCompanyFilter,
    );
  }

  get notificationSitesFilter(): Signal<TreeNode[]> {
    return this.store.selectSignal(
      NotificationListSelectors.NotificationSiteFilter,
    );
  }

  get dataSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(NotificationListSelectors.dataSites);
  }

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(NotificationListSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(NotificationListSelectors.dataServices);
  }

  get dataCategories(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(NotificationListSelectors.dataCategories);
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(NotificationListSelectors.selectedSiteList);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(
      NotificationListSelectors.selectedCompanyList,
    );
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(
      NotificationListSelectors.selectedServiceList,
    );
  }

  get filterCategories(): Signal<number[]> {
    return this.store.selectSignal(
      NotificationListSelectors.selectedCategoryList,
    );
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(NotificationListSelectors.isLoading);
  }

  @Dispatch()
  loadNotificationFilterList = () => new LoadNotificationFilterList();

  @Dispatch()
  loadNotificationFilterCategories = () =>
    new LoadNotificationFilterCategories();

  @Dispatch()
  updateNotificationFilterCategories = (data: number[]) =>
    new UpdateNotificationFilterCategories(data);

  @Dispatch()
  loadNotificationFilterServices = () => new LoadNotificationFilterServices();

  @Dispatch()
  updateNotificationFilterServices = (data: number[]) =>
    new UpdateNotificationFilterServices(data);

  @Dispatch()
  loadNotificationFilterCompanies = () => new LoadNotificationFilterCompanies();

  @Dispatch()
  updateNotificationFilterCompanies = (data: number[]) =>
    new UpdateNotificationFilterCompanies(data);

  @Dispatch()
  loadNotificationFilterSites = () => new LoadNotificationFilterSites();

  @Dispatch()
  updateNotificationFilterSites = (data: SharedSelectTreeChangeEventOutput) =>
    new UpdateNotificationFilterSites(data);

  @Dispatch()
  updateNotificationFilterByKey = (data: unknown, key: NotificationFilterKey) =>
    new UpdateNotificationFilterByKey(data, key);

  @Dispatch()
  clearNotificationFilter = () => new ClearNotificationFilter();
}
