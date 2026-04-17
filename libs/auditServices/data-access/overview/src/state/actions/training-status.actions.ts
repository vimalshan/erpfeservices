import { TrainingStatusModel } from '../../models';

export class LoadTrainingStatus {
  static readonly type = '[Training Status] Load Training Status';
}

export class RedirectToLms {
  static readonly type = '[Training Status] Redirect To LMS';

  constructor(public url: string) {}
}
export class LoadTrainingStatusSuccess {
  static readonly type = '[Training Status] Load Training Status Success';

  constructor(public trainingStatusList: TrainingStatusModel[]) {}
}
