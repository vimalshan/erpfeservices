export interface ScheduleCalendarFilterDto {
  data: ScheduleCalendarFilterDataDto[];
  isSuccess: boolean;
}

export interface ScheduleCalendarFilterDataDto {
  children?: ScheduleCalendarFilterDataDto[];
  id: number;
  label: string;
}
