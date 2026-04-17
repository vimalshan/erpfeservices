import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';

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
  unreadActionsCount(ctx: StateContext<UnreadActionsCountStateModel>) {
    return this.unreadActionsService.getUnreadActionsCount().pipe(
      tap((actions: UnreadActionsDto) => {
        const actionsCountResult =
          UnreadActionsCountMapperService.mapToUnreadActionsCountModel(actions);

        ctx.patchState({ actions: actionsCountResult });
      }),
    );
  }
}
