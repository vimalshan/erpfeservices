export interface ScheduleCalendarRescheduleReasonDto {
  data: ScheduleCalendarRescheduleReasonDataDto[];
  isSuccess: boolean;
}

export interface ScheduleCalendarRescheduleReasonDataDto {
  id: number;
  reasonDescription: string;
}
