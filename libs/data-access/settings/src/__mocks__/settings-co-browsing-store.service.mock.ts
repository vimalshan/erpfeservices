import { signal, WritableSignal } from '@angular/core';

export const isSuaadhyaUserMock: WritableSignal<boolean> = signal(false);

export const createSettingsCoBrowsingStoreServiceMock = () => ({
  updateIsSuaadhyaUser: jest.fn(),
  getCompanyList: jest.fn(),
  updateSelectedCobrowsingCompany: jest.fn(),
  get isSuaadhyaUser() {
    return isSuaadhyaUserMock;
  },
});
