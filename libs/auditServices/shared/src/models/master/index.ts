export interface SiteDetailsMaster {
  id: number;
  siteName: string;
  city: string;
  countryId: number;
  countryName: string;
  companyId: number;
  formattedAddress?: string;
  siteZip?: string;
  siteState?: string;
}

export interface ServiceDetailsMaster {
  id: number;
  serviceName: string;
}

export interface BaseApolloResponse<T = unknown> {
  data: T;
  errors?: { message: string }[];
  isSuccess?: boolean;
  message?: string;
  errorCode?: string;
  __typename?: string;
}
