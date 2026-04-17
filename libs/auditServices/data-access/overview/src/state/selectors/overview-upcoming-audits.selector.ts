import { Selector } from '@ngxs/store';

import {
  OverviewUpcomingAuditEvent,
  OverviewUpcomingAuditsStateModel,
} from '../../models';
import { OverviewUpcomingAuditsState } from '../overview-upcoming-audit.state';

export class OverviewUpcomingAuditsSelectors {
  @Selector([OverviewUpcomingAuditsState])
  static getUpcomingAuditEvent(
    event: OverviewUpcomingAuditsStateModel,
  ): OverviewUpcomingAuditEvent[] {
    return event?.events || [];
  }

  @Selector([OverviewUpcomingAuditsSelectors._isLoading])
  static isLoading(_isLoading: boolean): boolean {
    return _isLoading;
  }

  @Selector([OverviewUpcomingAuditsState])
  private static _isLoading(state: OverviewUpcomingAuditsStateModel): boolean {
    return state.isLoading;
  }
}
