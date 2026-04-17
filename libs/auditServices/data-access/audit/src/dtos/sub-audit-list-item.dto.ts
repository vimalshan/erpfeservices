export interface SubAuditListItemDto {
  auditId: number;
  sites: number[];
  services: number[];
  status: string;
  startDate: string;
  endDate: string;
  auditorTeam: string[];
}
