import { EventAction } from '@customer-portal/shared';

export interface ScheduleListItemModel {
  scheduleId: number;
  startDate: string;
  endDate: string;
  status: string;
  service: string;
  site: string;
  city: string;
  auditType: string;
  leadAuditor: string;
  siteRepresentative: string;
  company: string;
  eventActions: EventAction;
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
