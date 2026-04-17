import { BaseApolloResponse } from "@erp-services/shared";

export interface SettingsCompanyDetailsDto extends BaseApolloResponse<SettingsCompanyDetailsDataDto> {
  data: SettingsCompanyDetailsDataDto;
  isSuccess: boolean;
  message?: string;
}

export interface SettingsCompanyDetailsDataDto {
  isAdmin: boolean;
  legalEntities: SettingsCompanyDetailsLegalEntityDto[];
  parentCompany: SettingsCompanyDetailsLegalEntityDto | null;
  userStatus: string;
}

export interface SettingsCompanyDetailsLegalEntityDto {
  accountId: number;
  address: string;
  city: string;
  country: string;
  countryId: number;
  isSerReqOpen: boolean;
  organizationName: string;
  poNumberRequired: boolean;
  vatNumber: string;
  zipCode: string;
  accountSuaadhyaId: number;
  countryCode: string;
}

export interface SettingsCompanyDetailsCountryListDto {
  data: SettingsCompanyDetailsCountryListDataDto[];
  isSuccess: boolean;
}

export interface SettingsCompanyDetailsCountryListDataDto {
  countryCode: string;
  countryName: string;
  id: number;
  isActive: boolean;
}
