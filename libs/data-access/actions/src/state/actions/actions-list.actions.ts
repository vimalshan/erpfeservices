import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  FilterValue,
  GridConfig,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { ActionFilterKey } from '../../constants';

export class LoadActionsDetails {
  static readonly type = '[Actions Details] Load Actions Details';
}

export class LoadActionsFilterList {
  static readonly type = '[Actions Details] Load Filter List';
}

export class LoadActionFilterCategories {
  static readonly type = '[Action Filter] Load Categories';

  constructor(public params?: number[]) {}
}

export class LoadActionFilterCategoriesSuccess {
  static readonly type = '[Action Filter] Load Categories Success';

  constructor(public dataCategories: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateActionFilterCategories {
  static readonly type = '[Action Filter] Update Categories';

  constructor(public data: number[]) {}
}

export class LoadActionFilterServices {
  static readonly type = '[Action Filter] Load Services';
}

export class LoadActionFilterServicesSuccess {
  static readonly type = '[Action Filter] Load Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateActionFilterServices {
  static readonly type = '[Action Filter] Update Services';

  constructor(public data: number[]) {}
}

export class LoadActionFilterCompanies {
  static readonly type = '[Action Filter] Load Companies';
}

export class LoadActionFilterCompaniesSuccess {
  static readonly type = '[Action Filter] Load Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateActionFilterCompanies {
  static readonly type = '[Action Filter] Update Companies';

  constructor(public data: number[]) {}
}

export class LoadActionFilterSites {
  static readonly type = '[Action Filter] Load Sites';
}

export class LoadActionFilterSitesSuccess {
  static readonly type = '[Action Filter] Load Sites Success';

  constructor(public dataSites: TreeNode[]) {}
}

export class UpdateActionFilterSites {
  static readonly type = '[Action Filter] Update Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}
export class UpdateActionFilterByKey {
  static readonly type = '[Actions Details] Update Action Filter By Key';

  constructor(
    public data: unknown,
    public key: ActionFilterKey,
  ) {}
}

export class UpdateGridConfig {
  static readonly type = '[Action List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class LoadHighPriorityAction {
  static readonly type = '[Action List] Load High Priority Actions';

  constructor(public isHighPriority: boolean) {}
}

export class NavigateFromAction {
  static readonly type = '[Actions] Navigate From Action';

  constructor(
    public id: string,
    public type: string,
  ) {}
}

export abstract class NavigateFromActionsListAction {
  constructor(public notificationsFilters: FilterValue[]) {}
}

export class NavigateFromActionsListToScheduleListView extends NavigateFromActionsListAction {
  static readonly type = '[Actions] Navigate From Action To Schedule List View';
}

export class ClearActionFilter {
  static readonly type = '[Action Filter] Clear Filters';
}
