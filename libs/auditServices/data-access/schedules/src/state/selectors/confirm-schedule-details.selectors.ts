import { Selector } from '@ngxs/store';

import { CalendarDetailsModel, ConfirmScheduleModel } from '../../models';
import {
  ConfirmScheduleDetailsState,
  ConfirmScheduleDetailsStateModel,
} from '../confirm-schedule-details.state';

export class ConfirmScheduleDetailsSelectors {
  @Selector([ConfirmScheduleDetailsSelectors._confirmScheduleDetails])
  static confirmScheduleDetails(
    confirmScheduleDetails: ConfirmScheduleModel,
  ): ConfirmScheduleModel {
    return confirmScheduleDetails;
  }

  @Selector([ConfirmScheduleDetailsSelectors._canUploadData])
  static canUploadData(canUploadData: boolean): boolean {
    return canUploadData;
  }

  @Selector([ConfirmScheduleDetailsSelectors._calendarDetailsStatus])
  static calendarDetailsStatus(calendarDetailsStatus: string): string {
    return calendarDetailsStatus;
  }

  @Selector([ConfirmScheduleDetailsSelectors._calendarDetails])
  static calendarDetails(
    calendarDetails: CalendarDetailsModel,
  ): CalendarDetailsModel {
    return calendarDetails;
  }

  @Selector([ConfirmScheduleDetailsState])
  private static _confirmScheduleDetails(
    state: ConfirmScheduleDetailsStateModel,
  ): ConfirmScheduleModel {
    return state.confirmScheduleDetails;
  }

  @Selector([ConfirmScheduleDetailsState])
  private static _canUploadData(
    state: ConfirmScheduleDetailsStateModel,
  ): boolean {
    return state.canUploadData;
  }

  @Selector([ConfirmScheduleDetailsState])
  private static _calendarDetailsStatus(
    state: ConfirmScheduleDetailsStateModel,
  ): string {
    return state?.calendarDetails?.status || '';
  }

  @Selector([ConfirmScheduleDetailsState])
  private static _calendarDetails(
    state: ConfirmScheduleDetailsStateModel,
  ): CalendarDetailsModel {
    return state.calendarDetails;
  }
}
