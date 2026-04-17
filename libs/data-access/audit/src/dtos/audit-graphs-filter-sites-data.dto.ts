export interface AuditGraphsFilterSitesDataDto {
  data: AuditGraphsFilterSitesDataDto[];
  isSuccess: boolean;
}

export interface AuditGraphsFilterSitesDataDto {
  id: number;
  label: string;
  children?: AuditGraphsFilterSitesDataDto[];
}