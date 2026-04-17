import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { createProfileStoreServiceMock } from '@customer-portal/data-access/settings';

import { ProfileSettingsFooterComponent } from './profile-settings-footer.component';

describe('ProfileSettingsFooterComponent', () => {
  let component: ProfileSettingsFooterComponent;
  const refMock: Partial<DynamicDialogRef> = {};
  const profileStoreServiceMock = createProfileStoreServiceMock();

  beforeEach(async () => {
    component = new ProfileSettingsFooterComponent(
      refMock as DynamicDialogRef,
      profileStoreServiceMock as any,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
