import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { NotificationModel } from '../../models';
import { LoadUnreadNotifications } from '../actions';
import { UnreadNotificationsSelectors } from '../selectors';

@Injectable()
export class UnreadNotificationsStoreService {
  constructor(private store: Store) {}

  get unreadNotifications(): Signal<number> {
    return this.store.selectSignal(
      UnreadNotificationsSelectors.getUnreadNotificationsCount,
    );
  }

  @Dispatch()
  loadUnreadNotifications = (payload?: NotificationModel[]) =>
    new LoadUnreadNotifications(payload);
}
