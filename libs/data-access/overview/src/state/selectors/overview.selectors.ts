import { Selector } from '@ngxs/store';

import { CardDataModel } from '@customer-portal/shared';

import { OverviewState, OverviewStateModel } from '../overview.state';

export class OverviewSelectors {
  // #region Overview
  @Selector([OverviewSelectors._overviewCardData])
  public static overviewCardData(
    overviewCardData: CardDataModel[],
  ): CardDataModel[] {
    return overviewCardData;
  }

  @Selector([OverviewSelectors._hasMorePages])
  public static hasMorePages(hasMorePages: boolean) {
    return hasMorePages;
  }

  @Selector([OverviewState])
  private static _overviewCardData(state: OverviewStateModel): CardDataModel[] {
    return state.overviewCardData;
  }

  @Selector([OverviewState])
  private static _hasMorePages(state: OverviewStateModel): boolean {
    return state.pageInfo.totalPages > state.pageInfo.currentPage;
  }
  // #endregion Overview
}
