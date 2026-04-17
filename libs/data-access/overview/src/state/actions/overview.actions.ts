import { CardDataModel, CardNavigationPayload } from '@customer-portal/shared';

import { OverviewCardPageInfoModel } from '../../models';

export class LoadOverviewCardData {
  static readonly type = '[Overview] Load Overview Card Data';

  constructor(public shouldKeepPreviousData?: boolean) {}
}
export class LoadOverviewCardDataSuccess {
  static readonly type = '[Overview] Load Overview Card Data Success';

  constructor(
    public overviewCardData: CardDataModel[],
    public pageInfo: OverviewCardPageInfoModel,
    public shouldKeepPreviousData?: boolean,
  ) {}
}
export class LoadOverviewCardDataFail {
  static readonly type = '[Overview] Load Overview Card Data Fail';
}
export class LoadMoreOverviewCardData {
  static readonly type = '[Overview] Load More Overview Card Data';
}

export class ResetOverviewState {
  static readonly type = '[Overview] Reset Overview State';
}

export class NavigateFromOverviewCardToListView {
  static readonly type = '[Overview] Navigate From Overview Card To List View';

  constructor(public payload: CardNavigationPayload) {}
}
