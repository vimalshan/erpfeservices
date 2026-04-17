import { BaseApolloResponse } from '@erp-services/shared';
import { SidebarGroup } from '../models';



export interface ProfileDto extends BaseApolloResponse<ProfileInformationDto> {
  data: ProfileInformationDto;
  isSuccess: boolean;
  message?: string;
}

export interface ProfileInformationDto {
  firstName: string;
  lastName: string;
  displayName: string;
  country: string;
  countryCode: string;
  region: string;
  email: string;
  phone: string;
  portalLanguage: string;
  veracityId: string;
  communicationLanguage: string;
  jobTitle: string;
  languages: ProfileSettingsLanguagesDto[];
  accessLevel: ProfileSettingsAccessLevelDto[];
  sidebarMenu: SidebarGroup[];
}

interface ProfileSettingsLanguagesDto {
  languageName: string;
  isSelected: boolean;
}

interface ProfileSettingsAccessLevelDto {
  roleName: string;
  roleLevel: number[];
}
