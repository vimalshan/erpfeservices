export interface CalendarScheduleDto {
  data: CalendarScheduleDataDto[];
  isSuccess: boolean;
}

export interface CalendarScheduleDataDto {
  siteAuditId: number
  startDate: string;
  endDate: string;
  status: string;
  serviceIds: number[];
  siteId: number;
  auditType: string;
  leadAuditor: string;
  siteRepresentatives: string[];
  companyId: number;
  siteAddress: string; 
  auditID:number 
  reportingCountry: string;
  projectNumber: string;
  accountDNVId: string; 
}
