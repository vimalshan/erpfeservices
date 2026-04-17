import { signal, WritableSignal } from '@angular/core';

import {
  BarChartModel,
  EMPTY_GRAPH_DATA,
  SharedSelectMultipleDatum,
} from '@customer-portal/shared';

const dataCompanies: WritableSignal<SharedSelectMultipleDatum<number>[]> =
  signal([
    {
      label: 'Data Company 1',
      value: 1,
    },
  ]);

const dataServices: WritableSignal<SharedSelectMultipleDatum<number>[]> =
  signal([
    {
      label: 'Data Service 1',
      value: 1,
    },
  ]);

const dataSites: WritableSignal<SharedSelectMultipleDatum<number>[]> = signal([
  {
    label: 'Data Site 1',
    value: 1,
  },
]);

const findingsGraphData: WritableSignal<BarChartModel> =
  signal(EMPTY_GRAPH_DATA);

export const createFindingsGraphStoreServiceMock = () => ({
  setActiveFindingsTab: jest.fn(),
  loadFindingsGraphsData: jest.fn(),
  loadFindingsByStatusGraphsData: jest.fn(),
  loadFindingStatusByCategoryGraphData: jest.fn(),
  loadOpenFindingsGraphData: jest.fn(),
  loadFindingsByCategoryGraphData: jest.fn(),
  loadFindingsDataTrends: jest.fn(),
  resetFindingsGraphData: jest.fn(),
  loadFindingGraphsFilterCompanies: jest.fn(),
  loadFindingGraphsFilterServices: jest.fn(),
  loadFindingGraphsFilterSites: jest.fn(),
  updateFindingGraphsFilterByKey: jest.fn(),
  dataCompanies,
  dataServices,
  dataSites,
  overdueFindingsGraphData: findingsGraphData,
  becomingOverdueFindingsGraphData: findingsGraphData,
  inProgressFindingsGraphData: findingsGraphData,
  earlyStageFindingsGraphData: findingsGraphData,
});
