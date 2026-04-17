import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { SharedSelectTreeChangeEventOutput } from '@customer-portal/shared/models';
import { FilterValue, GridConfig } from '@customer-portal/shared/models/grid';

import { NotificationFilterKey } from '../../constants';
import { NotificationModel } from '../../models';

export class LoadNotificationsList {
  static readonly type = '[Notification Details] Load Notification List';
}

export class MarkNotificationAsRead {
  static readonly type = '[Notifications] Mark Notification As Read';

  constructor(public id: number) {}
}

export class UpdateNotifications {
  static readonly type = '[Notifications] Update Notifications';

  constructor(public notifications: NotificationModel[]) {}
}

export class NavigateFromNotification {
  static readonly type = '[Notifications] Navigate From Notification';

  constructor(
    public id: string,
    public type: string,
  ) {}
}

export class UpdateGridConfig {
  static readonly type = '[Notifications List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class LoadNotificationFilterList {
  static readonly type = '[Notification Filter] Load';
}

export class ClearNotificationFilter {
  static readonly type = '[Notification Filter] Clear Filters';
}

export class LoadNotificationFilterCategories {
  static readonly type = '[Notification Filter] Load Categories';

  constructor(public params?: number[]) {}
}

export class LoadNotificationFilterCategoriesSuccess {
  static readonly type = '[Notification Filter] Load Categories Success';

  constructor(public dataCategories: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateNotificationFilterCategories {
  static readonly type = '[Notification Filter] Update Categories';

  constructor(public data: number[]) {}
}

export class LoadNotificationFilterServices {
  static readonly type = '[Notification Filter] Load Services';
}

export class LoadNotificationFilterServicesSuccess {
  static readonly type = '[Notification Filter] Load Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateNotificationFilterServices {
  static readonly type = '[Notification Filter] Update Services';

  constructor(public data: number[]) {}
}

export class LoadNotificationFilterCompanies {
  static readonly type = '[Notification Filter] Load Companies';
}

export class LoadNotificationFilterCompaniesSuccess {
  static readonly type = '[Notification Filter] Load Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateNotificationFilterCompanies {
  static readonly type = '[Notification Filter] Update Companies';

  constructor(public data: number[]) {}
}

export class LoadNotificationFilterSites {
  static readonly type = '[Notification Filter] Load Sites';
}

export class LoadNotificationFilterSitesSuccess {
  static readonly type = '[Notification Filter] Load Sites Success';

  constructor(public dataSites: TreeNode[]) {}
}

export class UpdateNotificationFilterSites {
  static readonly type = '[Notification Filter] Update Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateNotificationFilterByKey {
  static readonly type = '[Notification Filter] Update by Key';

  constructor(
    public data: unknown,
    public key: NotificationFilterKey,
  ) {}
}

export class SetNavigationGridConfig {
  static readonly type = '[Notifications] Set Navigation Grid Config';

  constructor(public notificationsFilters: FilterValue[]) {}
}

export abstract class NavigateFromNotificationsListAction {
  constructor(public notificationsFilters: FilterValue[]) {}
}

export class NavigateFromNotificationsListToContractsListView extends NavigateFromNotificationsListAction {
  static readonly type =
    '[Notifications] Navigate From Notification To Contracts List View';
}

export class NavigateFromNotificationsListToFinancialsListView extends NavigateFromNotificationsListAction {
  static readonly type =
    '[Notifications] Navigate From Notification To Financials List View';
}

export class NavigateFromNotificationsListToScheduleListView extends NavigateFromNotificationsListAction {
  static readonly type =
    '[Notifications] Navigate From Notification To Schedule List View';
}
