import { runInInjectionContext, signal, WritableSignal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

import {
  createSettingsCoBrowsingStoreServiceMock,
  SettingsCoBrowsingStoreService,
  SettingsMembersStoreService,
} from '@customer-portal/data-access/settings';
import { createPreferenceMockInjector } from '@customer-portal/preferences';
import { createTranslationServiceMock } from '@customer-portal/shared';

import { AdminGridComponent } from './admin-grid.component';

describe('AdminGridComponent', () => {
  let component: AdminGridComponent;
  let settingsMembersStoreServiceMock: Partial<SettingsMembersStoreService>;
  const hasAdminActiveFilters: WritableSignal<boolean> = signal(false);
  let dialogServiceMock: Partial<DialogService>;
  let dynamicDialogRefMock: Partial<DynamicDialogRef>;
  let translocoServiceMock: Partial<TranslocoService>;
  const confirmationServiceMock: Partial<ConfirmationService> = {
    confirm: jest.fn().mockReturnValue(of(true)),
  };
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> =
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(async () => {
    const injector = createPreferenceMockInjector();
    dynamicDialogRefMock = { close: jest.fn() };
    dialogServiceMock = {
      open: jest.fn().mockReturnValue(dynamicDialogRefMock),
    };
    translocoServiceMock = createTranslationServiceMock();

    settingsMembersStoreServiceMock = {
      loadSettingsAdminList: jest.fn(),
      hasAdminActiveFilters,
      updateAdminGridConfig: jest.fn(),
      resetAdminListState: jest.fn(),
    };

    runInInjectionContext(injector, () => {
      component = new AdminGridComponent(
        settingsMembersStoreServiceMock as SettingsMembersStoreService,
        settingsCoBrowsingStoreServiceMock as SettingsCoBrowsingStoreService,
        dialogServiceMock as DialogService,
        translocoServiceMock as TranslocoService,
        confirmationServiceMock as ConfirmationService,
      );
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
