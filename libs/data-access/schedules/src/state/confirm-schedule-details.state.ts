import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';

import { ScheduleCalendarActionLocationTypes } from '../constants';
import { getScheduleDetails } from '../helpers';
import { CalendarDetailsModel, ConfirmScheduleModel } from '../models';
import {
  LoadCalendarDetails,
  LoadCalendarDetailsSuccess,
  SwitchCanUploadData,
} from './actions';

export interface ConfirmScheduleDetailsStateModel {
  scheduleId: number;
  confirmScheduleDetails: ConfirmScheduleModel;
  canUploadData: boolean;
  calendarDetails: CalendarDetailsModel;
}

const defaultState: ConfirmScheduleDetailsStateModel = {
  scheduleId: 0,
  confirmScheduleDetails: {
    scheduleId: 0,
    startDate: '',
    endDate: '',
    site: '',
    auditType: '',
    auditor: '',
    address: '',
    services: [],
  },
  canUploadData: false,
  calendarDetails: {
    scheduleId: 0,
    startDate: '',
    endDate: '',
    status: '',
    service: '',
    auditType: '',
    auditor: '',
    site: '',
    siteRepresentative: '',
    address: '',
    shareInvite: false,
  },
};

@State<ConfirmScheduleDetailsStateModel>({
  name: 'confirmScheduleDetails',
  defaults: defaultState,
})
@Injectable()
export class ConfirmScheduleDetailsState {
  constructor(private store: Store) {}

  @Action(SwitchCanUploadData)
  switchCanUploadData(
    ctx: StateContext<ConfirmScheduleDetailsStateModel>,
    { canUploadData }: SwitchCanUploadData,
  ) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      canUploadData,
    });
  }

  @Action(LoadCalendarDetails)
  loadCalendarDetails(
    ctx: StateContext<ConfirmScheduleDetailsStateModel>,
    { scheduleId, location }: LoadCalendarDetails,
  ) {
    let schedules = [];

    if (location === ScheduleCalendarActionLocationTypes.Calendar) {
      schedules = this.store.selectSnapshot(
        (state) => state?.scheduleListCalendar?.calendarSchedule ?? [],
      );
    } else if (location === ScheduleCalendarActionLocationTypes.List) {
      schedules = this.store.selectSnapshot(
        (state) => state?.scheduleList?.schedules ?? [],
      );
    } else {
      schedules = [];
    }

    const scheduleDetails = getScheduleDetails(
      schedules,
      String(scheduleId),
      location,
    );

    if (scheduleDetails) {
      ctx.dispatch(new LoadCalendarDetailsSuccess(scheduleDetails));
    }
  }

  @Action(LoadCalendarDetailsSuccess)
  loadCalendarDetailsSuccess(
    ctx: StateContext<ConfirmScheduleDetailsStateModel>,
    { calendarDetails }: LoadCalendarDetailsSuccess,
  ): void {
    ctx.patchState({ calendarDetails });
  }
}
