export interface OverviewUpcomingAuditDto {
  message: string | null | undefined;
  isSuccess: boolean;
  data: OverviewUpcomingAuditDataDto[];
}
export interface OverviewUpcomingAuditDataDto {
  confirmed: string[];
  toBeConfirmed: string[];
  toBeConfirmedByDNV: string[];
}
