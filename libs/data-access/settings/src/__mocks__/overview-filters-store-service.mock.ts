import { signal } from '@angular/core';

export const createOverviewFiltersStoreServiceMock = () => ({
  loadOverviewFilterList: jest.fn(),
  loadOverviewFilterCompanies: jest.fn(),
  loadOverviewFilterServices: jest.fn(),
  loadOverviewFilterSites: jest.fn(),
  updateOverviewFilterByKey: jest.fn(),
  updateOverviewFilterCompanies: jest.fn(),
  updateOverviewFilterServices: jest.fn(),
  updateOverviewFilterSites: jest.fn(),
  dataServices: signal([]),
  dataSites: signal([{ label: '1', value: 1 }]),
  filterCompanies: signal([]),
  filterServices: signal([]),
  filterSites: signal([1]),
});
