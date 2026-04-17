export interface AuditExcelPayloadDto {
  filters: {
    auditId: number[] | null;
    status: string[] | null;
    companyName: string[] | null;
    type: string[] | null;
    startDate: string[] | null;
    endDate: string[] | null;
    leadAuditor: string[] | null;
    city: string[] | null;
    site: string[] | null;
    service: string[] | null;
    country: string[] | null;
  };
}
