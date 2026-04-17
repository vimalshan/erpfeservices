export interface CalendarDetailsDto {
  data: CalendarDetailsDataDto;
  isSuccess: boolean;
}

export interface CalendarDetailsDataDto {
  scheduleId: number;
  startDate: string;
  endDate: string;
  status: string;
  services: ServiceDto[];
  site: string;
  address: string;
  auditType: string;
  leadAuditor: string;
  siteRepresentative: string;
}

export interface ServiceDto {
  id: number;
  name: string;
}
