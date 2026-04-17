export interface BaseServiceNowParams {
  language: string;
  reportingCountry: string;
  sys_id?: string;
  id?: string;
}

export interface NotificationParms {
  id: string;
  table: string;
  sys_id: string;
  language: string;
}
export interface CertificateParams extends BaseServiceNowParams {
  certificateNumber: string;
  revisionNumber: number;
  certificateID: number;
  certificateStatus: string;
  service: string;
  projectNumber: string;
  accountDNVId?: number;
}

export interface InvoiceParams extends BaseServiceNowParams {
  invoice: string;
  status: string;
  projectNumber: string;
  accountDNVId?: number;
}

export interface ScheduleParams extends BaseServiceNowParams {
  startDate: string;
  endDate: string;
  auditID: number;
  siteAuditID: number;
  site: string;
  status: string;
  siteAddress: string;
  siteCity: string;
  siteZip: string;
  siteCountry: string;
  siteState: string;
  service: string;
  projectNumber: string;
  accountDNVId?: number;
}

export interface CompanySettingsParams extends BaseServiceNowParams {
  accountName: string;
  accountAddress: string;
  accountDNVId?: number;
}
