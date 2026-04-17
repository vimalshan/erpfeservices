export interface ProfileModel {
  information: ProfileInformationModel;
}

export interface ProfileInformationModel {
  firstName: string;
  lastName: string;
  displayName: string;
  country: string;
  countryCode: string;
  region: string;
  email: string;
  phone: string;
  communicationLanguage: string;
  jobTitle: string;
  portalLanguage: string;
  veracityId: string;
  languages: ProfileSettingsLanguagesModel[];
  accessLevel: UserPermissions;
  sidebarMenu: SidebarGroup[];
}

export interface ProfileSettingsLanguagesModel {
  languageName: string;
  isSelected: boolean;
}

export interface ProfileSettingsAccessLevelModel {
  roleName: string;
  roleLevel: number[];
}

export interface UserPermissions {
  [key: string]: {
    noAccess: boolean;
    view: boolean;
    edit: boolean;
    submit?: boolean;
  };
}

export interface SidebarGroup {
  id: string;
  items: SidebarGroupItem[];
}

export interface SidebarGroupItem {
  i18nKey: string;
  icon: string;
  id: string;
  isDisabled: boolean;
  isVisible?: boolean;
  url: string;
  externalUrl?: string;
}

export interface UserValidation {
  userIsActive: boolean;
  termsAcceptanceRedirectUrl: string;
  policySubCode: null | number;
  isDnvUser: boolean;
  userEmail: string;
  veracityId: string;
  portalLanguage: string;
  isAdmin: boolean;
}
