import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { LoadUnreadActions } from '../actions';
import { UnreadActionsSelectors } from '../selectors';

@Injectable()
export class UnreadActionsStoreService {
  constructor(private store: Store) {}

  get unreadActions(): Signal<number> {
    return this.store.selectSignal(
      UnreadActionsSelectors.getUnreadActionsCount,
    );
  }

  @Dispatch()
  loadUnreadActions = () => new LoadUnreadActions();
}
