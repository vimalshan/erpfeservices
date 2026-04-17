import { signal } from '@angular/core';

export const createScheduleListStoreServiceMock = () => ({
  downloadAddToScheduleCalendar: jest.fn(),
  hasActiveFilters: signal(false),
  updateGridConfig: jest.fn(),
  loadScheduleList: jest.fn(),
  resetScheduleListState: jest.fn(),
  exportAuditSchedulesExcel: jest.fn(),
});
