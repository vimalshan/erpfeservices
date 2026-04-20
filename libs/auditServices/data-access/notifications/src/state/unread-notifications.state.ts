import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, EMPTY, tap } from 'rxjs';

import { UnreadNotificationCountDto } from '../dtos';
import { UnreadNotificationCountModel } from '../models';
import {
  UnreadNotificationCountMapperService,
  UnreadNotificationsService,
} from '../services';
import { LoadUnreadNotifications } from './actions';

export interface UnreadNotificationsStateModel {
  unreadNotificationsCount: UnreadNotificationCountModel;
}

const defaultState: UnreadNotificationsStateModel = {
  unreadNotificationsCount: {
    count: 0,
  },
};

@State<UnreadNotificationsStateModel>({
  name: 'unreadNotificationsCount',
  defaults: defaultState,
})
@Injectable()
export class UnreadNotificationsState {
  constructor(private unreadNotificationsService: UnreadNotificationsService) {}

  @Action(LoadUnreadNotifications)
  unreadNotificationList(_ctx: StateContext<UnreadNotificationsStateModel>) {
    // informationCount endpoint not available on backend
    return EMPTY;
  }
}
