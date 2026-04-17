import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { DoughnutChartModel, EMPTY_GRAPH_DATA } from '@customer-portal/shared';

import {
  OverviewFinancialStatusMapperService,
  OverviewFinancialStatusService,
} from '../services';
import { LoadOverviewFinancialStatusData } from './actions';

export interface OverviewFinancialStatusStateModel {
  overviewFinancialStatusGraphData: DoughnutChartModel;
  overviewFinancialStatusError: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

const defaultState: OverviewFinancialStatusStateModel = {
  overviewFinancialStatusGraphData: EMPTY_GRAPH_DATA,
  overviewFinancialStatusError: false,
  isLoading: false,
  errorMessage: '',
};
@State<OverviewFinancialStatusStateModel>({
  name: 'financialStatus',
  defaults: defaultState,
})
@Injectable()
export class OverviewFinancialStatusState {
  constructor(
    private readonly overviewFinancialStatusService: OverviewFinancialStatusService,
  ) {}

  @Action(LoadOverviewFinancialStatusData)
  loadOverviewFinancialStatusData(
    ctx: StateContext<OverviewFinancialStatusStateModel>,
  ) {
    ctx.patchState({
      isLoading: true,
      errorMessage: '',
      overviewFinancialStatusGraphData: EMPTY_GRAPH_DATA,
    });

    return this.overviewFinancialStatusService
      .getOverviewFinancialWidget()
      .pipe(
        tap((overviewFinancialStatusGraphDto) => {
          const overviewFinancialData =
            OverviewFinancialStatusMapperService.mapToOverviewFinancialStatusModel(
              overviewFinancialStatusGraphDto,
            );

          if (overviewFinancialData.isSuccess) {
            ctx.patchState({
              overviewFinancialStatusGraphData: overviewFinancialData,
              overviewFinancialStatusError: false,
              isLoading: false,
              errorMessage: '',
            });
          } else {
            ctx.patchState({
              overviewFinancialStatusError: true,
              isLoading: false,
              errorMessage: overviewFinancialData.message,
            });
          }
        }),
        catchError(() => {
          ctx.patchState({
            overviewFinancialStatusError: true,
            isLoading: false,
            errorMessage: 'Failed To load overview financial status',
          });

          return of(null);
        }),
      );
  }
}
