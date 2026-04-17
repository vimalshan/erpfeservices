import { signal } from '@angular/core';

export const createOverviewSharedStoreServiceMock = () => ({
  overviewUpcomingAuditSelectedDate: signal(undefined),
  overviewFinancialStatus: signal([]),
  setSelectedDate: jest.fn(),
  navigateFromChartToListView: jest.fn(),
  setFinancialStatusChartNavigationPayload: jest.fn(),
  resetOverviewSharedState: jest.fn(),
});
