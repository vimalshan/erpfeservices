import { BaseApolloResponse } from '@customer-portal/shared';
import { SidebarGroup } from '../models';



export interface ProfileDto extends BaseApolloResponse<ProfileInformationDto> {
  data: ProfileInformationDto;
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
