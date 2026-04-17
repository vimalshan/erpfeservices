import { BaseApolloResponse } from '@customer-portal/shared';

export interface OverviewFilterDto {
  data: OverviewFilterDataDto[];
  isSuccess: boolean;
}

export interface OverviewFilterDataDto {
  children?: OverviewFilterDataDto[];
  id: number;
  label: string;
}

export interface OverviewCompanyServiceSiteFilterResponse {
  siteId: number;
  companyId: number;
  serviceId: number;
}

export interface OverviewCompanyServiceSiteFilterData
  extends BaseApolloResponse<OverviewCompanyServiceSiteFilterResponse[]> {
  data: OverviewCompanyServiceSiteFilterResponse[];
}
