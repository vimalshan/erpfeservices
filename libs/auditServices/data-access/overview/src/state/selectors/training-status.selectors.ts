import { Selector } from '@ngxs/store';

import { TrainingStatusModel } from '../../models';
import {
  TrainingStatusState,
  TrainingStatusStateModel,
} from '../training-status.state';

export class TrainingStatusSelectors {
  @Selector([TrainingStatusState])
  static trainingStatusDetails(
    state: TrainingStatusStateModel,
  ): TrainingStatusModel[] {
    return state.trainings;
  }

  @Selector([TrainingStatusSelectors._isLoading])
  static isLoading(_isLoading: boolean): boolean {
    return _isLoading;
  }

  @Selector([TrainingStatusState])
  static trainingStatusError(state: TrainingStatusStateModel): boolean {
    return state.traningStatusError;
  }

  @Selector([TrainingStatusState])
  private static _isLoading(state: TrainingStatusStateModel): boolean {
    return state.isLoading;
  }
}
