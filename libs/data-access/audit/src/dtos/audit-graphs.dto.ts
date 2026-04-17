export interface AuditGraphsFilterCompaniesDto {
  data: AuditGraphsFilterCompaniesDataDto[];
  isSuccess: boolean;
}

export interface AuditGraphsFilterCompaniesDataDto {
  id: number;
  label: string;
}

export interface AuditGraphsFilterServicesDto {
  data: AuditGraphsFilterServicesDataDto[];
  isSuccess: boolean;
}

export interface AuditGraphsFilterServicesDataDto {
  id: number;
  label: string;
}

export interface AuditGraphsFilterSitesDto {
  data: AuditGraphsFilterSitesDataDto[];
  isSuccess: boolean;
}

export interface AuditGraphsFilterSitesDataDto {
  id: number;
  label: string;
  children?: AuditGraphsFilterSitesDataDto[];
}
