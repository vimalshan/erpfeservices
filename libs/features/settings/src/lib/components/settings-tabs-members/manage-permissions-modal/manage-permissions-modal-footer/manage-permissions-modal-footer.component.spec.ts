import { signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings';

import { ManagePermissionsModalFooterComponent } from './manage-permissions-modal-footer.component';

describe('ManagePermissionsModalFooterComponent', () => {
  let component: ManagePermissionsModalFooterComponent;
  let refMock: Partial<DynamicDialogRef>;
  let settingsMembersStoreServiceMock: Partial<SettingsMembersStoreService>;
  let confirmationServiceMock: Partial<ConfirmationService>;
  let translocoServiceMock: Partial<TranslocoService>;
  let configMock: Partial<DynamicDialogConfig>;

  beforeEach(() => {
    refMock = {
      close: jest.fn(),
    };
    settingsMembersStoreServiceMock = {
      isAddMemberFormValid: signal(false),
    };
    confirmationServiceMock = {
      confirm: jest.fn(),
    };
    translocoServiceMock = {
      translate: jest.fn().mockImplementation((key) => key),
    };
    configMock = {
      data: {
        showBackBtn: true,
      },
    };

    component = new ManagePermissionsModalFooterComponent(
      settingsMembersStoreServiceMock as SettingsMembersStoreService,
      refMock as DynamicDialogRef,
      confirmationServiceMock as ConfirmationService,
      translocoServiceMock as TranslocoService,
      configMock as DynamicDialogConfig,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
