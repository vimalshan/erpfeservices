import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';

import {
  createProfileStoreServiceMock,
  createSettingsCoBrowsingStoreServiceMock,
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  createDialogServiceMock,
  createTranslationServiceMock,
  modalBreakpoints,
} from '@customer-portal/shared';

import { ProfileSettingsFooterComponent } from '../profile-settings-footer';
import { ProfileSettingsModalComponent } from '../profile-settings-modal';
import { SettingsTabsPersonalInformationComponent } from './settings-tabs-personal-information.component';

describe('SettingsTabsPersonalInformationComponent', () => {
  let component: SettingsTabsPersonalInformationComponent;
  const profileStoreServiceMock: Partial<ProfileStoreService> =
    createProfileStoreServiceMock();
  const mockDialogService: Partial<DialogService> = createDialogServiceMock();
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    component = new SettingsTabsPersonalInformationComponent(
      profileStoreServiceMock as ProfileStoreService,
      settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
      mockDialogService as DialogService,
      createTranslationServiceMock() as TranslocoService,
    );
  });

  test('should open edit settings dialog with correct parameters', () => {
    // Arrange
    const openSpy = jest.spyOn(mockDialogService, 'open');
    const translateSpy = jest
      .spyOn((component as any).ts, 'translate')
      .mockReturnValue('Edit portal settings');

    // Act
    component.onClickEditSettings();

    // Assert
    expect(translateSpy).toHaveBeenCalledWith(
      'settings.form.profile.settingsModal.header',
    );
    expect(openSpy).toHaveBeenCalledWith(ProfileSettingsModalComponent, {
      header: 'Edit portal settings',
      width: '50vw',
      contentStyle: { overflow: 'auto', padding: '0' },
      breakpoints: modalBreakpoints,
      data: {
        languages: [{ isSelected: false, languageName: 'English' }],
        jobTitle: 'Certification manager',
        roles: ['Admin'],
      },
      templates: {
        footer: ProfileSettingsFooterComponent,
      },
    });
  });

  test('on clicking the veracity we wil redirect user to repective page', () => {
    // Arrange
    const spy = jest.spyOn(window, 'open').mockImplementation(() => null);

    const pageName = 'Profile';

    // Act
    component.onEditVeracityClick(pageName);

    // Assert
    expect(window.open).toHaveBeenCalledWith(
      'https://id.veracity.com/Profile',
      '_blank',
    );
    spy.mockRestore();
  });
});
