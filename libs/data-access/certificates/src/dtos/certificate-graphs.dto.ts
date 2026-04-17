export interface CertificateGraphsFilterCompaniesDto {
  data: CertificateGraphsFilterCompaniesDataDto[];
  isSuccess: boolean;
}

export interface CertificateGraphsFilterCompaniesDataDto {
  id: number;
  label: string;
}

export interface CertificateGraphsFilterServicesDto {
  data: CertificateGraphsFilterServicesDataDto[];
  isSuccess: boolean;
}

export interface CertificateGraphsFilterServicesDataDto {
  id: number;
  label: string;
}

export interface CertificateGraphsFilterSitesDto {
  data: CertificateGraphsFilterSitesDataDto[];
  isSuccess: boolean;
}

export interface CertificateGraphsFilterSitesDataDto {
  id: number;
  label: string;
  children?: CertificateGraphsFilterSitesDataDto[];
}


export interface CertificateGraphsFilterCompaniesDto {
    data: CertificateGraphsFilterCompaniesDataDto[];
    isSuccess: boolean;
}

export interface CertificateGraphsFilterCompaniesDataDto {
    id: number;
    label: string;
}

export interface CertificateGraphsFilterServicesDto {
    data: CertificateGraphsFilterServicesDataDto[];
    isSuccess: boolean;
}

export interface CertificateGraphsFilterServicesDataDto {
    id: number;
    label: string;
}

export interface CertificateGraphsFilterSitesDto {
    data: CertificateGraphsFilterSitesDataDto[];
    isSuccess: boolean;
}

export interface CertificateGraphsFilterSitesDataDto {
    id: number;
    label: string;
    children?: CertificateGraphsFilterSitesDataDto[];
}