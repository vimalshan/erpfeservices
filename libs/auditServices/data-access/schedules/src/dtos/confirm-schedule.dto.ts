export interface ConfirmScheduleDto {
  data: ConfirmScheduleDetailsDto;
  isSuccess: boolean;
}

export interface ConfirmScheduleDetailsDto {
  scheduleId: number;
  startDate: string;
  endDate: string;
  site: string;
  auditType: string;
  auditor: string;
  address: string;
  schemes: ScheduleSchemeDto[];
}

export interface ScheduleSchemeDto {
  id: number;
  scheduleId: number;
  service: string;
}
