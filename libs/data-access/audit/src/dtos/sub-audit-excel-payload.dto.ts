export interface SubAuditExcelPayloadDto {
  auditId: number;
  filters: {
    startDate: string[];
    endDate: string[];
    status: string[];
    service: string[];
    sites: string[];
    city: string[];
    auditorTeam: string[];
  };
}
