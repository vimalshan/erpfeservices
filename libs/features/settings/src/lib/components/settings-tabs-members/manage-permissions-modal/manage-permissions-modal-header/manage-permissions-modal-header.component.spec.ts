import { HashMap, TranslateParams, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { SettingsMembersStoreService } from '@customer-portal/data-access/settings';

import { ManagePermissionsModalHeaderComponent } from './manage-permissions-modal-header.component';

jest.mock('@customer-portal/data-access/settings');
jest.mock('primeng/dynamicdialog');
jest.mock('primeng/api');
jest.mock('@jsverse/transloco');

describe('ManagePermissionsModalHeaderComponent', () => {
  let component: ManagePermissionsModalHeaderComponent;
  let settingsMembersStoreService: jest.Mocked<SettingsMembersStoreService>;
  let ref: jest.Mocked<DynamicDialogRef>;
  let confirmationService: jest.Mocked<ConfirmationService>;
  let ts: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    // Arrange
    settingsMembersStoreService = {
      hasMemberPermissionsChanged: jest.fn(),
    } as unknown as jest.Mocked<SettingsMembersStoreService>;
    ref = new DynamicDialogRef() as jest.Mocked<DynamicDialogRef>;
    confirmationService =
      new ConfirmationService() as jest.Mocked<ConfirmationService>;
    ts = {
      translate: jest
        .fn()
        .mockImplementation(
          (key: TranslateParams, _params?: HashMap, _lang?: string) =>
            `Translated: ${key}`,
        ),
    } as unknown as jest.Mocked<TranslocoService>;

    component = new ManagePermissionsModalHeaderComponent(
      settingsMembersStoreService,
      ref,
      confirmationService,
      ts,
    );
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should call confirmationService.confirm when permissions have changed', () => {
    // Arrange
    settingsMembersStoreService.hasMemberPermissionsChanged.mockReturnValue(
      true,
    );

    // Act
    component.onClick();

    // Assert
    expect(confirmationService.confirm).toHaveBeenCalledWith({
      header: 'Translated: settings.discardDraftPopup.header',
      message: 'Translated: settings.discardDraftPopup.message',
      reject: expect.any(Function),
      acceptLabel: 'Translated: settings.discardDraftPopup.continueEditing',
      rejectLabel: 'Translated: settings.discardDraftPopup.discard',
      acceptIcon: 'null',
      rejectIcon: 'null',
      acceptButtonStyleClass: 'accept-button',
      rejectButtonStyleClass: 'reject-button',
    });
  });

  test('should close the dialog with false when reject is called', () => {
    // Arrange
    settingsMembersStoreService.hasMemberPermissionsChanged.mockReturnValue(
      true,
    );

    component.onClick();
    const rejectCallback = confirmationService.confirm.mock.calls[0][0].reject;

    // Act
    if (rejectCallback) {
      rejectCallback();
    }

    // Assert
    expect(ref.close).toHaveBeenCalledWith(false);
  });

  test('should not call confirmationService.confirm when permissions have not changed', () => {
    // Arrange
    settingsMembersStoreService.hasMemberPermissionsChanged.mockReturnValue(
      false,
    );

    // Act
    component.onClick();

    // Assert
    expect(confirmationService.confirm).not.toHaveBeenCalled();
  });
});
