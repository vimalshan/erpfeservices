import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { TrainingStatusModel } from '../../models';
import { LoadTrainingStatus, RedirectToLms } from '../actions';
import { TrainingStatusSelectors } from '../selectors';

@Injectable()
export class TrainingStatusStoreService {
  get trainingStatusDetails(): Signal<TrainingStatusModel[]> {
    return this.store.selectSignal(
      TrainingStatusSelectors.trainingStatusDetails,
    );
  }

  get trainingStatusError(): Signal<boolean> {
    return this.store.selectSignal(TrainingStatusSelectors.trainingStatusError);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(TrainingStatusSelectors.isLoading);
  }

  constructor(private store: Store) {}

  @Dispatch()
  loadTrainingStatus = () => new LoadTrainingStatus();

  @Dispatch()
  redirectToLms = (url: string) => new RedirectToLms(url);
}
