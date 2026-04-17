import { signal } from '@angular/core';

import { EMPTY_GRAPH_DATA } from '@erp-services/shared';

export const createOverviewFinancialStatusStoreServiceMock = () => ({
  loadOverviewFinancialStatusData: jest.fn(),
  overviewFinancialStatusGraphData: signal(EMPTY_GRAPH_DATA),
});
