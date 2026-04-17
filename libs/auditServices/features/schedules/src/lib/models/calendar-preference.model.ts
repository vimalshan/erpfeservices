import { ScheduleCalendarFilterKey } from '@erp-services/data-access/schedules';

export interface CalendarPrefenceModel {
  filters: Partial<Record<ScheduleCalendarFilterKey, number[]>>;
  view: string;
}
