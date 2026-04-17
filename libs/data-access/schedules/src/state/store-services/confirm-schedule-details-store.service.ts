import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { ScheduleCalendarActionLocationTypes } from '../../constants';
import { CalendarDetailsModel, ConfirmScheduleModel } from '../../models';
import { LoadCalendarDetails, SwitchCanUploadData } from '../actions';
import { ConfirmScheduleDetailsSelectors } from '../selectors';

@Injectable()
export class ConfirmScheduleDetailsStoreService {
  get confirmScheduleDetails(): Signal<ConfirmScheduleModel> {
    return this.store.selectSignal(
      ConfirmScheduleDetailsSelectors.confirmScheduleDetails,
    );
  }

  get canUploadData(): Signal<boolean> {
    return this.store.selectSignal(
      ConfirmScheduleDetailsSelectors.canUploadData,
    );
  }

  get auditDetailsStatus(): Signal<string> {
    return this.store.selectSignal(
      ConfirmScheduleDetailsSelectors.calendarDetailsStatus,
    );
  }

  get calendarDetails(): Signal<CalendarDetailsModel> {
    return this.store.selectSignal(
      ConfirmScheduleDetailsSelectors.calendarDetails,
    );
  }

  constructor(private store: Store) {}

  @Dispatch()
  switchCanUploadData = (canUploadData: boolean) =>
    new SwitchCanUploadData(canUploadData);

  @Dispatch()
  loadCalendarDetails = (
    scheduleId: number,
    location: ScheduleCalendarActionLocationTypes,
  ) => new LoadCalendarDetails(scheduleId, location);
}
