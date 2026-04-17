import {
  EventAction,
  GridTextWithIconModel,
  MemberPermissions,
  SiteModel,
} from '@customer-portal/shared';

export interface SettingsMembersItemModel {
  name: string;
  email: string;
  company: string;
  services: string;
  sites: string;
  access: string;
  isDisabled: boolean;
  eventActions?: EventAction;
  iconTooltip?: GridTextWithIconModel;
}

export interface SettingsNewMemberFormModel {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface MemberAreasPermissions {
  area: string;
  permission: MemberPermissions;
}

export enum MemberAreaPermissions {
  Contracts = 'contracts',
  Schedules = 'schedules',
  Audits = 'audits',
  Findings = 'findings',
  Certificates = 'certificates',
  Financials = 'financials',
}

export enum AccessAreaRoleNames {
  CONTRACTS_VIEW = 'Contracts_View',
  CONTRACTS_EDIT = 'Contracts_Edit',
  SCHEDULE_VIEW = 'Schedule_View',
  SCHEDULE_EDIT = 'Schedule_Edit',
  AUDITS_VIEW = 'Audits_View',
  AUDITS_EDIT = 'Audits_Edit',
  FINDINGS_VIEW = 'Findings_View',
  FINDINGS_EDIT = 'Findings_Edit',
  FINDINGS_SUBMIT = 'Findings_Submit',
  CERTIFICATES_VIEW = 'Certificates_View',
  CERTIFICATES_EDIT = 'Certificates_Edit',
  FINANCIALS_EDIT = 'Financials_Edit',
}

export interface CreateContactAccessArea {
  roleId: number;
  roleName: string;
}

export interface CreateContactCompany {
  companyId: number;
  companyName: string;
}

interface CreateContactService {
  serviceId: number;
  serviceName: string;
}

interface CreateContactSite {
  siteId: number;
  siteName: string;
}

interface CreateContactCity {
  cityName: string;
  sites: CreateContactSite[];
}

interface CreateContactCountry {
  countryId: number;
  countryName: string;
  cities: CreateContactCity[];
}

export interface CreateContactRequest {
  email: string;
  firstName: string;
  lastName: string;
  communicationLanguage: string;
  phone: string;
  countryId: number;
  jobTitle: string;
  isAdmin: number;
  accessAreas: CreateContactAccessArea[];
  companies: CreateContactCompany[];
  services: CreateContactService[];
  countries: CreateContactCountry[];
}

export interface UserDetailsToManagePermission {
  userId: number;
  companies: UserDetailsToManagePermissionCompany[];
  accessArea: UserDetailsToManagePermissionAccessArea[];
}

export interface SelectedUserDetailsModel {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
}

export interface UserDetailsToManagePermissionCompany {
  companyId: number;
  companyName: string;
  hasParentId: boolean;
  parentId: number;
  isCompanySelected: boolean;
  services: UserDetailsToManagePermissionService[];
}

export interface UserDetailsToManagePermissionService {
  serviceId: number;
  serviceName: string;
  isServiceSelected: boolean;
  countries: UserDetailsToManagePermissionCountry[];
}

export interface UserDetailsToManagePermissionCountry {
  countryName: string;
  isCountrySelected: boolean;
  cities: UserDetailsToManagePermissionCity[];
}

export interface UserDetailsToManagePermissionCity {
  cityName: string;
  isCitySelected: boolean;
  sites: UserDetailsToManagePermissionSite[];
}

export interface UserDetailsToManagePermissionSite {
  siteId: number;
  siteName: string;
  isSiteSelected: boolean;
}

export interface UserDetailsToManagePermissionAccessArea {
  email: string;
  roleId: number;
  roleName: string;
}

export interface ManageMembersRequestModel {
  userId: number;
  email: string;
  isAdmin: number;
  accessAreas: CreateContactAccessArea[];
  companies: CreateContactCompany[];
  services: CreateContactService[];
  countries: CreateContactCountry[];
}

interface MembersPermissionsCityModel {
  cityName: string;
  sites: SiteModel[];
  isCitySelected?: boolean;
}

interface MembersPermissionsCountryModel {
  countryId: number;
  countryName: string;
  cities: MembersPermissionsCityModel[];
  isCountrySelected?: boolean;
}

interface PermissionsServiceModel {
  isServiceSelected?: boolean;
  serviceId: number;
  serviceName: string;
  countries: MembersPermissionsCountryModel[];
}

interface MembersPermissionsCompanyModel {
  companyId: number;
  companyName: string;
  hasParentId: boolean;
  isCompanySelected?: boolean;
  parentId: number;
  services: PermissionsServiceModel[];
}

interface UserPermissionsData {
  companies: MembersPermissionsCompanyModel[];
  userId: number;
  jobTitle: string;
  emailId: string;
  firstName: string;
  lastName: string;
}

export interface SettingsMembersPermissionsDataModel {
  data: UserPermissionsData[];
  errorCode: string;
  isSuccess: boolean;
  message: string;
}
