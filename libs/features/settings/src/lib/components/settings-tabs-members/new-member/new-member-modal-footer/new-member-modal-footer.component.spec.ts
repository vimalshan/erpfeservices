import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  createSettingsMemberServiceMock,
  SettingsMembersStoreService,
} from '@customer-portal/data-access/settings';
import {
  createDynamicDialogRefServiceMock,
  createMessageServiceMock,
} from '@customer-portal/shared';

import { NewMemberModalFooterComponent } from './new-member-modal-footer.component';

describe('NewMemberModalFooterComponent', () => {
  let component: NewMemberModalFooterComponent;
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  const refMock: Partial<DynamicDialogRef> =
    createDynamicDialogRefServiceMock();
  const settingsMembersStoreServiceMock: Partial<SettingsMembersStoreService> =
    createSettingsMemberServiceMock();

  beforeEach(async () => {
    component = new NewMemberModalFooterComponent(
      messageServiceMock as any,
      refMock as DynamicDialogRef,
      settingsMembersStoreServiceMock as SettingsMembersStoreService,
    );
  });

  test('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  test('should close dialog with provided data', () => {
    // Arrange
    const data = true;

    // Act
    component.closeDialog(data);

    // Assert
    expect(refMock.close).toHaveBeenCalledWith(data);
  });

  test('should show error message if form is invalid', () => {
    // Arrange
    jest
      .spyOn(settingsMembersStoreServiceMock, 'isAddMemberFormValid')
      .mockReturnValue(false);
    const addMemberSpy = jest.spyOn(messageServiceMock, 'add');
    const expectedParameter = {
      icon: 'pi-exclamation-circle',
      severity: 'warn',
      summary: 'All fields are mandatory',
    };

    // Act
    component.onSubmit();

    // Assert
    expect(addMemberSpy).toHaveBeenCalledWith(
      expect.objectContaining(expectedParameter),
    );
  });

  test('should close dialog with true if form is valid', () => {
    // Arrange
    jest
      .spyOn(settingsMembersStoreServiceMock, 'isAddMemberFormValid')
      .mockReturnValue(true);

    // Act
    component.onSubmit();

    // Assert
    expect(refMock.close).toHaveBeenCalledWith(true);
  });
});
