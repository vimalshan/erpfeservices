export interface ScheduleExcelPayloadDto {
  filters: {
    startDate: string[] | null;
    endDate: string[] | null;
    status: string[] | null;
    service: string[] | null;
    site: string[] | null;
    city: string[] | null;
    auditType: string[] | null;
    leadAuditor: string[] | null;
    siteRepresentative: string[] | null;
    company: string[] | null;
    siteAuditId: string[] | null;
  };
}
