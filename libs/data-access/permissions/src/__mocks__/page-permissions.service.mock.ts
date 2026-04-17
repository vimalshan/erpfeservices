import { signal, WritableSignal } from '@angular/core';

import { UserPermissions } from '@customer-portal/data-access/settings';

const mappedUserPermissionsData = {
  certificates: {
    noAccess: false,
    view: true,
    edit: true,
  },
  contracts: {
    noAccess: false,
    view: true,
    edit: false,
  },
  financials: {
    noAccess: false,
    view: false,
    edit: true,
  },
  schedule: {
    noAccess: false,
    view: true,
    edit: true,
  },
  findings: {
    noAccess: false,
    view: true,
    edit: true,
  },
  audits: {
    noAccess: false,
    view: true,
    edit: true,
  },
};

const userPermissions: WritableSignal<UserPermissions> = signal(
  mappedUserPermissionsData,
);

export const createPagePermissionsServiceMock = () => ({
  userPermissions,

  hasPageAccess: jest.fn(),
});
