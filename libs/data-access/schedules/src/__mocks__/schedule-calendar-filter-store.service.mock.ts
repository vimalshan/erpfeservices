import { signal } from '@angular/core';

export const createScheduleCalendarFilterStoreServiceMock = () => ({
  loadScheduleCalendarFilterList: jest.fn(),
  loadScheduleCalendarFilterCompanies: jest.fn(),
  loadScheduleCalendarFilterServices: jest.fn(),
  loadScheduleCalendarFilterSites: jest.fn(),
  loadScheduleCalendarFilterStatuses: jest.fn(),
  updateScheduleCalendarFilterByKey: jest.fn(),
  updateScheduleCalendarFilterCompanies: jest.fn(),
  updateScheduleCalendarFilterServices: jest.fn(),
  updateScheduleCalendarFilterSites: jest.fn(),
  updateScheduleCalendarFilterStatuses: jest.fn(),
  dataCompanies: signal([]),
  dataServices: signal([]),
  dataSites: signal([{ label: '1', value: 1 }]),
  dataStatuses: signal([
    { label: '2', value: 2 },
    { label: '3', value: 3 },
  ]),
  filterCompanies: signal([]),
  filterServices: signal([]),
  filterSites: signal([1]),
  filterStatuses: signal([2, 3]),
});
