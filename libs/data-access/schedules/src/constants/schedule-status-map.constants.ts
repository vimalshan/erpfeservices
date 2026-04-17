import { StatesClasses } from '@customer-portal/shared';

export enum ScheduleStatus {
  Confirmed = 'Confirmed',
  ToBeConfirmed = 'To Be Confirmed',
  ToBeConfirmedByDnv = 'To Be Confirmed by DNV',
}

export const SCHEDULE_STATUS_MAP: Record<string, string> = {
  [ScheduleStatus.Confirmed.toLowerCase()]: StatesClasses.ForestGreen,
  [ScheduleStatus.ToBeConfirmed.toLowerCase()]: StatesClasses.SunflowerYellow,
  [ScheduleStatus.ToBeConfirmedByDnv.toLowerCase()]: StatesClasses.SummerSky,
};
