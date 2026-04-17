import { Selector } from '@ngxs/store';

import {
  UnreadActionsCountStateModel,
  UnreadActionsState,
} from '../unread-actions.state';

export class UnreadActionsSelectors {
  @Selector([UnreadActionsState])
  static getUnreadActionsCount(state: UnreadActionsCountStateModel): number {
    return state?.actions.count || 0;
  }
}
