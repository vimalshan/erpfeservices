import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';

import { NotificationModel } from '../../models';
import {
  NotificationListState,
  NotificationsListStateModel,
} from '../notification-list.state';

export class NotificationListSelectors {
  @Selector([NotificationListState])
  static getNotifications(
    state: NotificationsListStateModel,
  ): NotificationModel[] {
    return state.notifications;
  }

  @Selector([NotificationListSelectors._dataSites])
  static dataSites(dataSites: TreeNode[]): TreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([NotificationListSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([NotificationListSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([NotificationListSelectors._dataCategories])
  static dataCategories(
    dataCategories: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCategories;
  }

  @Selector([NotificationListSelectors._selectedSiteList])
  static selectedSiteList(selectedSiteList: number[]): number[] {
    return selectedSiteList;
  }

  @Selector([NotificationListSelectors._selectedServiceList])
  static selectedServiceList(selectedServiceList: number[]): number[] {
    return selectedServiceList;
  }

  @Selector([NotificationListSelectors._selectedCompanyList])
  static selectedCompanyList(selectedCompanyList: number[]): number[] {
    return selectedCompanyList;
  }

  @Selector([NotificationListSelectors._selectedCategoryList])
  static selectedCategoryList(selectedCategoryList: number[]): number[] {
    return selectedCategoryList;
  }

  @Selector([NotificationListSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([NotificationListState])
  static totalNotificationsRecords(state: NotificationsListStateModel): number {
    return state.totalItems;
  }

  @Selector([NotificationListState])
  static NotificationCategoryFilter(
    state: NotificationsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.categoryFilter;
  }

  @Selector([NotificationListState])
  static NotificationServiceFilter(
    state: NotificationsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.serviceFilter;
  }

  @Selector([NotificationListState])
  static NotificationCompanyFilter(
    state: NotificationsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.companyFilter;
  }

  @Selector([NotificationListState])
  static NotificationSiteFilter(
    state: NotificationsListStateModel,
  ): TreeNode<any>[] {
    return structuredClone(state.siteFilter);
  }

  @Selector([NotificationListState])
  static hasActiveFilters(state: NotificationsListStateModel): boolean {
    return !!(
      state.selectedCategoryList.length ||
      state.selectedCompanyList.length ||
      state.selectedServiceList.length ||
      state.selectedSiteList.length
    );
  }

  @Selector([NotificationListState])
  private static _dataSites(state: NotificationsListStateModel): TreeNode[] {
    return state?.dataSites;
  }

  @Selector([NotificationListState])
  private static _dataCompanies(
    state: NotificationsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCompanies;
  }

  @Selector([NotificationListState])
  private static _dataServices(
    state: NotificationsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataServices;
  }

  @Selector([NotificationListState])
  private static _dataCategories(
    state: NotificationsListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCategories;
  }

  @Selector([NotificationListState])
  private static _selectedCompanyList(
    state: NotificationsListStateModel,
  ): number[] {
    return state?.selectedCompanyList;
  }

  @Selector([NotificationListState])
  private static _selectedCategoryList(
    state: NotificationsListStateModel,
  ): number[] {
    return state?.selectedCategoryList;
  }

  @Selector([NotificationListState])
  private static _selectedServiceList(
    state: NotificationsListStateModel,
  ): number[] {
    return state?.selectedServiceList;
  }

  @Selector([NotificationListState])
  private static _selectedSiteList(
    state: NotificationsListStateModel,
  ): number[] {
    return state?.selectedSiteList;
  }

  @Selector([NotificationListState])
  private static _isLoading(state: NotificationsListStateModel): boolean {
    return state.isLoading;
  }
}
