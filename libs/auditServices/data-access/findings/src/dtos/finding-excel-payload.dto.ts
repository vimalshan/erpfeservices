export interface FindingExcelPayloadDto {
  filters: {
    findings: string[] | null;
    status: string[] | null;
    title: string[] | null;
    category: string[] | null;
    companyName: string[] | null;
    service: string[] | null;
    site: string[] | null;
    country: string[] | null;
    city: string[] | null;
    auditId: string[] | null;
    openDate: string[] | null;
    closedDate: string[] | null;
    acceptedDate: string[] | null;
    findingsId: string[] | null;
    response: string[] | null;
  };
}
