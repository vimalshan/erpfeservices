import { Signal, signal, WritableSignal } from '@angular/core';

const hasMembersActiveFilters: WritableSignal<boolean> = signal(false);

export const createSettingsMemberServiceMock = () => ({
  isAddMemberFormValid: jest.fn() as unknown as Signal<boolean>,
  switchContinueToPermissionsStatus: jest.fn(),
  updateNewMemberForm: jest.fn(),
  loadSettingsMembersList: jest.fn(),
  hasMembersActiveFilters,
  updateMembersGridConfig: jest.fn(),
  resetMembersListState: jest.fn(),
});
