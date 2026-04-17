import { TreeNode } from 'primeng/api';

import {
  GridConfig,
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

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

export class RedirectToPage {
  static readonly type = '[Notifications] Redirect To Page';

  constructor(
    public url: string,
    public rowData: NotificationModel[],
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
