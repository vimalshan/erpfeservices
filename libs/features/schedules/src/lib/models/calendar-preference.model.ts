import { ScheduleCalendarFilterKey } from '@customer-portal/data-access/schedules';

export interface CalendarPrefenceModel {
  filters: Partial<Record<ScheduleCalendarFilterKey, number[]>>;
  view: string;
}
