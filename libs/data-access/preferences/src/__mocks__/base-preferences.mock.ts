import { DestroyRef, Injector } from '@angular/core';
import { Actions } from '@ngxs/store';

import {
  createActionsMock,
  createDestroyRefMock,
} from '@customer-portal/shared';

import { PreferenceStoreService } from '../state';

const createPreferenceStoreMock = () => ({
  loadPreference: jest.fn(),
  savePreference: jest.fn(),
  getData: jest.fn().mockReturnValue({ view: 'month', calendarFilters: {} }),
});

export const createPreferenceMockInjector = () =>
  Injector.create({
    providers: [
      {
        provide: PreferenceStoreService,
        useValue: createPreferenceStoreMock(),
      },
      { provide: Actions, useValue: createActionsMock() },
      { provide: DestroyRef, useValue: createDestroyRefMock() },
    ],
  });
