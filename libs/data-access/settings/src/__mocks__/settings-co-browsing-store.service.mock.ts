import { signal, WritableSignal } from '@angular/core';

export const isDnvUserMock: WritableSignal<boolean> = signal(false);

export const createSettingsCoBrowsingStoreServiceMock = () => ({
  updateIsDnvUser: jest.fn(),
  getCompanyList: jest.fn(),
  updateSelectedCobrowsingCompany: jest.fn(),
  get isDnvUser() {
    return isDnvUserMock;
  },
});
