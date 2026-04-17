import { StatesClasses } from '@erp-services/shared';

export enum ScheduleStatus {
  Confirmed = 'Confirmed',
  ToBeConfirmed = 'To Be Confirmed',
  ToBeConfirmedBySuaadhya = 'To Be Confirmed by Suaadhya',
}

export const SCHEDULE_STATUS_MAP: Record<string, string> = {
  [ScheduleStatus.Confirmed.toLowerCase()]: StatesClasses.ForestGreen,
  [ScheduleStatus.ToBeConfirmed.toLowerCase()]: StatesClasses.SunflowerYellow,
  [ScheduleStatus.ToBeConfirmedBySuaadhya.toLowerCase()]: StatesClasses.SummerSky,
};
