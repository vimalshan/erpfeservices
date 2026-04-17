import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { SwitchCanUploadData } from './actions';
import {
  ConfirmScheduleDetailsState,
  ConfirmScheduleDetailsStateModel,
} from './confirm-schedule-details.state';

const MOCK_DEFAULT_STATE: ConfirmScheduleDetailsStateModel = {
  scheduleId: 0,
  confirmScheduleDetails: {
    scheduleId: 0,
    startDate: '',
    endDate: '',
    site: '',
    auditType: '',
    auditor: '',
    address: '',
    services: [],
  },
  canUploadData: false,
  calendarDetails: {
    scheduleId: 0,
    startDate: '',
    endDate: '',
    status: '',
    service: '',
    auditType: '',
    auditor: '',
    site: '',
    address: '',
    siteRepresentative: '',
    shareInvite: false,
  },
};

describe('ConfirmScheduleDetailsState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ConfirmScheduleDetailsState])],
    });

    store = TestBed.inject(Store);
  });

  test('should initialize with default state', () => {
    // Arrange
    const defaultState = MOCK_DEFAULT_STATE;

    // Act
    const actualState = store.selectSnapshot((s) => s.confirmScheduleDetails);

    // Assert
    expect(actualState).toEqual(defaultState);
  });

  test('should switch canUploadData', () => {
    // Arrange
    const action = new SwitchCanUploadData(true);

    // Act
    store.dispatch(action);

    // Assert
    expect(
      store.selectSnapshot((s) => s.confirmScheduleDetails.canUploadData),
    ).toBe(true);
  });
});
