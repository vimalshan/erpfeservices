export interface AuditDetailsDto {
  data: AuditDetailsDescriptionDto;
  isSuccess: boolean;
}

export interface AuditDetailsDescriptionDto {
  auditId: number;
  status: string;
  services: string[];
  siteName: string;
  siteAddress: string;
  startDate: string;
  endDate: string;
  leadAuditor: string;
  auditorTeam: string[];
}
