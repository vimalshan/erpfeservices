import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { TrainingStatusGraphResponseDto } from '../../dtos';
import { WIDGET_FOR_TRAINING_STATUS_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class TrainingStatusService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getTrainingStatusList(): Observable<TrainingStatusGraphResponseDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: WIDGET_FOR_TRAINING_STATUS_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.widgetforTrainingStatus));
  }
}
