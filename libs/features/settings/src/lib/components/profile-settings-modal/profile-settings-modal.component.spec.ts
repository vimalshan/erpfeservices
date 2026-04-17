import { DestroyRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import {
  createProfileStoreServiceMock,
  ProfileStoreService,
} from '@customer-portal/data-access/settings';

import { ProfileSettingsModalComponent } from './profile-settings-modal.component';

describe('ProfileSettingsModalComponent', () => {
  let component: ProfileSettingsModalComponent;
  let mockFormBuilder: Partial<FormBuilder>;
  const profileStoreServiceMock: Partial<ProfileStoreService> =
    createProfileStoreServiceMock();
  const mockDynamicDialogConfig: Partial<DynamicDialogConfig> = {
    data: {
      languages: [
        {
          languageName: 'English',
          isSelected: true,
        },
      ],
      jobTitle: 'Certification manager',
      roles: ['Admin'],
    },
  };
  const destroyRefMock: Partial<DestroyRef> = {};

  beforeEach(async () => {
    mockFormBuilder = new FormBuilder();
    component = new ProfileSettingsModalComponent(
      mockDynamicDialogConfig as DynamicDialogConfig,
      profileStoreServiceMock as ProfileStoreService,
      destroyRefMock as DestroyRef,
      mockFormBuilder as FormBuilder,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should update languages, jobTitle and selectedLanguage if config data is complete', () => {
    // Act
    const selectedRole = {
      value: 'Certification manager',
      label: 'Certification manager',
    };

    // Assert
    expect(component.languages()).toStrictEqual([
      {
        languageName: 'English',
        isSelected: true,
      },
    ]);
    expect(selectedRole.value).toBe('Certification manager');
    expect(component.selectedLanguage).toStrictEqual({
      languageName: 'English',
      isSelected: true,
    });
  });

  test('should call initializeForm & handleFormStateChanged on init', () => {
    // Arrange
    const initializeFormSpy = jest.spyOn(component, 'initializeForm');
    const handleFormStateChangedSpy = jest.spyOn(
      component,
      'handleFormStateChanged',
    );

    // Act
    component.ngOnInit();

    // Assert
    expect(initializeFormSpy).toHaveBeenCalled();
    expect(handleFormStateChangedSpy).toHaveBeenCalled();
  });
  test('should call updateSubmitSettingsStatus with false on destroy', () => {
    // Arrange
    const updateSubmitSettingsStatusSpy = jest.spyOn(
      profileStoreServiceMock,
      'updateSubmitSettingsStatus',
    );

    // Act
    component.ngOnDestroy();

    // Assert
    expect(updateSubmitSettingsStatusSpy).toHaveBeenCalled();
  });
});
