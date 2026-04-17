import { CURRENT_DATE_FORMAT } from '@customer-portal/shared/constants';
import {
  convertToUtcDate,
  utcDateToPayloadFormat,
} from '@customer-portal/shared/helpers/date';

import {
  ScheduleCalendarActionLocationTypes,
  ScheduleStatus,
} from '../constants';
import { CalendarScheduleModel } from '../models';

export const getScheduleDetails = (
  schedules: CalendarScheduleModel[],
  id: string,
  location: ScheduleCalendarActionLocationTypes = ScheduleCalendarActionLocationTypes.Calendar,
) => {
  const scheduleDetails = schedules.find(
    (s) => Number(s.scheduleId) === Number(id),
  );

  if (!scheduleDetails) return null;

  return {
    ...scheduleDetails,
    scheduleId: Number(scheduleDetails.scheduleId),
    startDate:
      location === ScheduleCalendarActionLocationTypes.Calendar
        ? convertToUtcDate(scheduleDetails.startDate, CURRENT_DATE_FORMAT)
        : utcDateToPayloadFormat(
            scheduleDetails.startDate,
            CURRENT_DATE_FORMAT,
          ),
    endDate:
      location === ScheduleCalendarActionLocationTypes.Calendar
        ? convertToUtcDate(scheduleDetails.endDate, CURRENT_DATE_FORMAT)
        : utcDateToPayloadFormat(scheduleDetails.endDate, CURRENT_DATE_FORMAT),
    auditor: scheduleDetails.leadAuditor,
    siteRepresentative: scheduleDetails.siteRepresentative,
    shareInvite:
      scheduleDetails.status === ScheduleStatus.Confirmed ||
      scheduleDetails.status === ScheduleStatus.ToBeConfirmed,
  };
};
