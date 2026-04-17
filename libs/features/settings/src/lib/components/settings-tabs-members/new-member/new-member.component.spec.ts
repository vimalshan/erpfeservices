import { DestroyRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import {
  createSettingsMemberServiceMock,
  SettingsMembersStoreService,
} from '@customer-portal/data-access/settings';
import { createDestroyRefMock } from '@customer-portal/shared';

import { NewMemberModalComponent } from './new-member.component';

describe('NewMemberModalComponent', () => {
  let component: NewMemberModalComponent;
  const formBuilder = new FormBuilder();
  const settingsMembersStoreServiceMock: Partial<SettingsMembersStoreService> =
    createSettingsMemberServiceMock();
  const destroyRefMock: Partial<DestroyRef> = createDestroyRefMock();
  const mockDynamicDialogConfig: Partial<DynamicDialogConfig> = {
    data: {
      roles: ['Admin', 'User'],
    },
  };

  beforeEach(async () => {
    component = new NewMemberModalComponent(
      mockDynamicDialogConfig as DynamicDialogConfig,
      destroyRefMock as DestroyRef,
      formBuilder,
      settingsMembersStoreServiceMock as SettingsMembersStoreService,
    );
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should initialize form with provided data', () => {
    // Arrange
    const expectedValue = {
      firstName: '',
      lastName: '',
      email: '',
      role: null,
    };

    // Act
    component.ngOnInit();

    // Assert
    expect(component.form.value).toEqual(expectedValue);
  });
});
