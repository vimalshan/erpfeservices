import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, EMPTY, tap } from 'rxjs';

import { UnreadActionsDto } from '../dtos';
import { UnreadActionsCountModel } from '../models';
import {
  UnreadActionsCountMapperService,
  UnreadActionsService,
} from '../services';
import { LoadUnreadActions } from './actions';

export interface UnreadActionsCountStateModel {
  actions: UnreadActionsCountModel;
}

const defaultState: UnreadActionsCountStateModel = {
  actions: {
    count: 0,
  },
};

@State<UnreadActionsCountStateModel>({
  name: 'unreadActionsCount',
  defaults: defaultState,
})
@Injectable()
export class UnreadActionsState {
  constructor(private unreadActionsService: UnreadActionsService) {}

  @Action(LoadUnreadActions)
  unreadActionsCount(_ctx: StateContext<UnreadActionsCountStateModel>) {
    // actionsCount endpoint not available on backend
    return EMPTY;
  }
}
