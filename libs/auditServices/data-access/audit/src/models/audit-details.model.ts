export interface AuditDetailsModel {
  auditNumber: number;
  header: AuditDetailsHeader;
}

export interface AuditDetailsHeader {
  status: string;
  services: string;
  siteName: string;
  siteAddress: string;
  startDate: string;
  endDate: string;
  auditor: string;
  auditorTeam: string[];
  auditPlanDocId: number[];
  auditReportDocId: number[];
}
