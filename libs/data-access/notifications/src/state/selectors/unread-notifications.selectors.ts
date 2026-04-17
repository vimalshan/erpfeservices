import { Selector } from '@ngxs/store';

import {
  UnreadNotificationsState,
  UnreadNotificationsStateModel,
} from '../unread-notifications.state';

export class UnreadNotificationsSelectors {
  @Selector([UnreadNotificationsState])
  static getUnreadNotificationsCount(
    state: UnreadNotificationsStateModel,
  ): number {
    return state?.unreadNotificationsCount.count || 0;
  }
}
