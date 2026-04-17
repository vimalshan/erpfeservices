import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, map, of, tap } from 'rxjs';

import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { ToastSeverity } from '@customer-portal/shared/models';

import { TrainingStatusGraphResponseDto } from '../dtos';
import { TrainingStatusListWithStatus, TrainingStatusModel } from '../models';
import { TrainingStatusMapper, TrainingStatusService } from '../services';
import {
  LoadTrainingStatus,
  LoadTrainingStatusSuccess,
  RedirectToLms,
} from './actions';

export interface TrainingStatusStateModel {
  trainings: TrainingStatusModel[];
  traningStatusError: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

const defaultState: TrainingStatusStateModel = {
  trainings: [],
  traningStatusError: false,
  isLoading: false,
  errorMessage: '',
};

@State<TrainingStatusStateModel>({
  name: 'TrainingStatus',
  defaults: defaultState,
})
@Injectable()
export class TrainingStatusState {
  constructor(
    private trainingStatusService: TrainingStatusService,
    private messageService: MessageService,
  ) {}

  @Action(LoadTrainingStatus)
  loadTrainingStatus(ctx: StateContext<TrainingStatusStateModel>) {
    ctx.patchState({
      isLoading: true,
      errorMessage: '',
      trainings: [],
    });

    return this.trainingStatusService.getTrainingStatusList().pipe(
      map((trainingStatusList: TrainingStatusGraphResponseDto) =>
        TrainingStatusMapper.mapToTrainingStatusList(trainingStatusList),
      ),
      throwIfNotSuccess(),
      tap((trainingStatus: TrainingStatusListWithStatus) => {
        ctx.dispatch(new LoadTrainingStatusSuccess(trainingStatus.data));
      }),
      catchError(() => {
        ctx.patchState({
          traningStatusError: true,
          trainings: [],
          isLoading: false,
          errorMessage: 'Failed to load overview training status data',
        });

        return of(null);
      }),
    );
  }

  @Action(LoadTrainingStatusSuccess)
  loadActionsDetailsSuccess(
    ctx: StateContext<TrainingStatusStateModel>,
    { trainingStatusList }: LoadTrainingStatusSuccess,
  ): void {
    ctx.patchState({
      trainings: trainingStatusList,
      traningStatusError: false,
      errorMessage: '',
      isLoading: false,
    });
  }

  @Action(RedirectToLms)
  redirectToLms(
    ctx: StateContext<TrainingStatusStateModel>,
    action: RedirectToLms,
  ): void {
    if (action.url) {
      window.open(action.url, '_blank');
    } else {
      this.messageService.add(
        getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
      );
    }
  }
}
