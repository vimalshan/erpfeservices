export interface AuditFindingsExcelPayloadDto {
  filters: {
    findings: number[] | null;
    status: string[] | null;
    title: string[] | null;
    category: string[] | null;
    companyName: string[] | null;
    service: string[] | null;
    city: string[] | null;
    site: string[] | null;
    openDate: string[] | null;
    acceptedDate: string[] | null;
    closeDate: string[] | null;
    audit: string[] | null;
    auditId: number[] | null;
  };
}
