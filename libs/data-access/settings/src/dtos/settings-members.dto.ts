import { CompanyModel, ServiceModel, SiteModel } from '@customer-portal/shared';

export interface SettingsMembersListDto {
  data: SettingsMembersListItemDto[];
  isSuccess: boolean;
  message: string;
  errorCode: string;
}

export interface SettingsMembersListItemDto {
  name: string;
  email: string;
  userStatus: string;
  roles: string;
  canDelete: boolean;
  canManagePermissions: boolean;
  companies: CompanyModel[];
  services: ServiceModel[];
  countries: Country[];
}

export interface City {
  cityName: string;
  sites: SiteModel[];
  isCitySelected?: boolean;
}

export interface Country {
  countryId: number;
  countryName: string;
  cities: City[];
  isCountrySelected?: boolean;
}

export interface SettingsAdminListDto {
  data: SettingsAdminListItemDto[];
  isSuccess: boolean;
  message: string;
  errorCode: string;
}

export interface SettingsAdminListItemDto {
  name: string;
  email: string;
  userStatus: string;
  isCurrentUser: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
  companies: CompanyModel[];
}

interface PermissionsService {
  isServiceSelected?: boolean;
  serviceId: number;
  serviceName: string;
  countries: Country[];
}

interface PermissionsCompany {
  companyId: number;
  companyName: string;
  hasParentId: boolean;
  isCompanySelected?: boolean;
  parentId: number;
  services: PermissionsService[];
}

interface UserPermissionsData {
  companies: PermissionsCompany[];
  userId: number;
  jobTitle: string;
  emailId: string;
  firstName: string;
  lastName: string;
}

export interface SettingsMembersPermissionsDto {
  data: UserPermissionsData[];
  errorCode: string;
  isSuccess: boolean;
  message: string;
}
