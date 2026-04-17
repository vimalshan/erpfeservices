import { signal } from '@angular/core';
import { of } from 'rxjs';

import { SIDEBAR_MENU_GROUP_LIST } from '../constants';

const profileSettingsMock = signal({
  languages: [
    {
      languageName: 'English',
      isSelected: false,
    },
  ],
  jobTitle: 'Certification manager',
  communicationLanguage: 'English',
});

export const createProfileStoreServiceMock = () => ({
  loadProfileData: jest.fn(),
  profileSettings: profileSettingsMock,
  updateSubmitSettingsStatus: jest.fn(),
  updateSubmitSettingsStateValues: jest.fn(),
  updateSubmitSettingsValues: jest.fn(),
  profileInformation: signal({
    firstName: 'John',
    lastName: '',
    displayName: '',
    country: '',
    countryCode: '',
    region: '',
    email: '',
    phone: '',
    communicationLanguage: 'English',
    jobTitle: 'Certification manager',
    portalLanguage: 'English',
    veracityId: '123456789',
    languages: [{ isSelected: false, languageName: 'English' }],
    accessLevel: { audits: { view: true, edit: true, noAccess: false } },
    sidebarMenu: SIDEBAR_MENU_GROUP_LIST,
  }),
  profileInformationAccessLevel: of({
    audits: { view: true, edit: true, noAccess: false },
  }),
  hasPermission: jest.fn(),
  userRoles: signal(['Admin']),
  loadUserRoles: jest.fn(),
  setInitialLoginStatus: jest.fn(),
});
