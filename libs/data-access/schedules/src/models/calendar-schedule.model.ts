export interface CalendarScheduleModel {
  address: string;
  auditType: string;
  city: string;
  company: string;
  endDate: string;
  leadAuditor: string;
  scheduleId: string;
  service: string;
  site: string;
  siteRepresentative: string;
  startDate: string;
  status: string;
  siteAuditId: number;
  siteAddress: string;
  auditID: number;
  siteZip: string;
  siteCountry: string;
  siteState: string;
  reportingCountry: string;
  projectNumber: string;
  accountDNVId: number;
}

export interface CalendarScheduleParams {
  month?: number;
  year?: number;
  companies?: number[];
  services?: number[];
  sites?: number[];
  statuses?: number[];
}
