export interface CertificatesBySiteDto {
  data: CertificateBySiteData;
}

export interface CertificateBySiteData {
  country: CertificateBySiteCountry[];
  services: CertificateBySiteServices[];
}

export interface CertificateBySiteServices {
  serviceId: number;
  serviceName: string;
}

export interface CertificateBySiteBaseNode {
  services: CertificateBySiteServices[];
}

export interface CertificateBySiteCountry extends CertificateBySiteBaseNode {
  countryName: string;
  cities: CertificateBySiteCity[];
}

export interface CertificateBySiteCity extends CertificateBySiteBaseNode {
  cityName: string;
  sites: CertificateBySiteSite[];
}

export interface CertificateBySiteSite extends CertificateBySiteBaseNode {
  siteName: string;
}

export interface CertificateBySiteGenericNode {
  countryName?: string;
  cityName?: string;
  siteName?: string;
  cities?: CertificateBySiteCity[];
  sites?: CertificateBySiteSite[];
  services: CertificateBySiteServices[];
}
