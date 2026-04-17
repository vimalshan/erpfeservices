import { signal, WritableSignal } from '@angular/core';

import {
  BarChartModel,
  DoughnutChartModel,
  EMPTY_GRAPH_DATA,
} from '@customer-portal/shared';

const auditStatusDoughnutGraphData: WritableSignal<DoughnutChartModel> =
  signal(EMPTY_GRAPH_DATA);

const auditsStatusBarGraphData: WritableSignal<BarChartModel> =
  signal(EMPTY_GRAPH_DATA);

const auditDaysDoughnutGraphData: WritableSignal<DoughnutChartModel> =
  signal(EMPTY_GRAPH_DATA);

const auditDaysBarGraphData: WritableSignal<BarChartModel> =
  signal(EMPTY_GRAPH_DATA);

export const createAuditChartsStoreServiceMock = () => ({
  loadAuditStatusDoughnutGraphData: jest.fn(),
  loadAuditStatusBarGraphData: jest.fn(),
  loadAuditDaysDoughnutGraphData: jest.fn(),
  loadAuditDaysBarGraphData: jest.fn(),
  updateAuditGraphsFilterByKey: jest.fn(),
  loadAuditGraphsFilterSites: jest.fn(),
  loadAuditGraphsFilterServices: jest.fn(),
  loadAuditGraphsFilterCompanies: jest.fn(),
  resetAuditsGraphState: jest.fn(),
  resetAuditsGraphsData: jest.fn(),
  loadAuditsGraphsData: jest.fn(),
  setActiveAuditsTab: jest.fn(),
  navigateFromChartToListView: jest.fn(),
  navigateFromTreeToListView: jest.fn(),
  auditStatusDoughnutGraphData,
  auditsStatusBarGraphData,
  auditDaysDoughnutGraphData,
  auditDaysBarGraphData,
});
