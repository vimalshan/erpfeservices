export interface ScheduleCalendarInviteDto {
  data: ScheduleCalendarInviteDataDto;
  isSuccess: boolean;
}

export interface ScheduleCalendarInviteDataDto {
  calendarAttributes?: ScheduleCalendarInviteCalendarAttributesDto;
  icsResponse: number[];
}

export interface ScheduleCalendarInviteCalendarAttributesDto {
  auditType: string;
  endDate: Date;
  leadAuditor: string;
  service: string;
  site: string;
  siteAddress: string;
  siteRepresentative: string;
  startDate: Date;
}
