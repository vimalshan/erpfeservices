import { signal } from '@angular/core';

import { CalendarDetailsModel, ConfirmScheduleModel } from '../models';

export const createConfirmScheduleDetailsStoreServiceMock = () => ({
  loadCalendarDetails: jest.fn(),
  loadRescheduleReasons: jest.fn(),
  switchCanUploadData: jest.fn(),
  confirmScheduleDetails: signal<ConfirmScheduleModel>({
    scheduleId: 10,
    startDate: '10.08.2024',
    endDate: '15.08.2024',
    site: 'Site test',
    auditType: 'Type test',
    auditor: 'Test',
    address: 'Street test',
    services: [],
  }),
  rescheduleReasonsList: signal([]),
  calendarDetails: signal({
    startDate: '2023-01-01',
    endDate: '2023-01-02',
  } as CalendarDetailsModel),
  canUploadData: signal(false),
});
