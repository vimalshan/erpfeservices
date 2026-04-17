import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';

import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { ToastSeverity } from '@customer-portal/shared/models';

import {
  OverviewUpcomingAuditEvent,
  OverviewUpcomingAuditsStateModel,
} from '../models';
import { OverviewUpcomingAuditService } from '../services';
import { OverviewUpcomingAuditMapperService } from '../services/mappers/overview-upcoming-audit-mapper.service';
import { LoadOverviewUpcomingAuditEvents } from './actions';

export interface OverviewUpcomingAuditStateModel {
  events: OverviewUpcomingAuditEvent[];
  selectedYear: number;
  selectedMonth: number;
  isLoading: boolean;
  errorMessage: string | null;
}

const defaultState: OverviewUpcomingAuditStateModel = {
  events: [],
  selectedYear: 0,
  selectedMonth: 0,
  isLoading: false,
  errorMessage: '',
};

@State<OverviewUpcomingAuditsStateModel>({
  name: 'overviewUpcomingAudits',
  defaults: defaultState,
})
@Injectable()
export class OverviewUpcomingAuditsState {
  constructor(
    private overviewUpcomingAuditService: OverviewUpcomingAuditService,
    private messageService: MessageService,
  ) {}

  @Action(LoadOverviewUpcomingAuditEvents)
  loadOverviewUpcomingAuditEvents(
    ctx: StateContext<OverviewUpcomingAuditsStateModel>,
    { selectedMonth, selectedYear }: LoadOverviewUpcomingAuditEvents,
  ) {
    ctx.patchState({
      isLoading: true,
      errorMessage: '',
    });

    return this.overviewUpcomingAuditService
      .getOverviewUpcomingAuditEvents(selectedMonth, selectedYear)
      .pipe(
        throwIfNotSuccess(),
        tap((response) => {
          const formattedEvents =
            response.data?.length > 0
              ? OverviewUpcomingAuditMapperService.mapToOverviewUpcomingAudit(
                  response.data[0],
                )
              : [];
          ctx.patchState({
            isLoading: false,
            errorMessage: '',
            events: formattedEvents,
            selectedMonth,
            selectedYear,
          });
        }),
        catchError(() => {
          this.messageService.add(
            getToastContentBySeverity(ToastSeverity.SomethingWentWrong),
          );
          ctx.patchState({
            events: [],
            selectedYear: 0,
            selectedMonth: 0,
            isLoading: false,
            errorMessage: 'Failed to load overview upcoming audit data',
          });

          return of([]);
        }),
      );
  }
}
