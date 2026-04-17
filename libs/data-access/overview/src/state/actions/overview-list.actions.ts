import {
  CardNavigationPayload,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { OverviewFilterTypes } from '../../constants';

export class LoadOverviewListCardData {
  static readonly type = '[Overview List] Load Overview List Card Data';

  constructor(public shouldKeepPreviousData?: boolean) {}
}
export class LoadOverviewListCardDataSuccess {
  static readonly type = '[Overview List] Load Overview List Card Data Success';

  constructor(public shouldKeepPreviousData?: boolean) {}
}
export class LoadOverviewListCardDataFail {
  static readonly type = '[Overview List] Load Overview List Card Data Fail';
}
export class LoadMoreOverviewListCardData {
  static readonly type = '[Overview List] Load More Overview List Card Data';
}

export class LoadOverviewListFilters {
  static readonly type = '[Overview List] Load Overview List List Filters';
}

export class LoadOverviewListFiltersFail {
  static readonly type = '[Overview List] Load Overview List List Filters Fail';

  constructor(public error: Error) {}
}

export class UpdateOverviewListFilterByKey {
  static readonly type = '[Overview List] Overview List Update Filter By Key';

  constructor(
    public data: any,
    public key: OverviewFilterTypes,
  ) {}
}

export class UpdateOverviewListFilterCompanies {
  static readonly type = '[Overview List] Update Filter Companies';

  constructor(public data: number[]) {}
}

export class UpdateOverviewListFilterServices {
  static readonly type = '[Overview List] Update Filter Services';

  constructor(public data: number[]) {}
}

export class UpdateOverviewListFilterSites {
  static readonly type = '[Overview List] Update Filter Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class ResetOverviewListFilterState {
  static readonly type = '[Overview List] Reset Overview List Filter State';
}

export class ResetOverviewListState {
  static readonly type = '[Overview List] Reset Overview List State';
}

export class NavigateFromOverviewListCardToListView {
  static readonly type =
    '[Overview List] Navigate From Overview List Card To List View';

  constructor(public payload: CardNavigationPayload) {}
}
