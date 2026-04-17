import { signal, WritableSignal } from '@angular/core';
import { TreeNode } from 'primeng/api';

const dataCompanies: WritableSignal<any[]> = signal([]);
const dataServices: WritableSignal<[]> = signal([]);
const dataSites: WritableSignal<any[]> = signal([]);
const filterCompanies: WritableSignal<number[]> = signal([]);
const filterServices: WritableSignal<number[]> = signal([]);
const prefillSites: WritableSignal<TreeNode[]> = signal([]);
const filterDateRange: WritableSignal<Date[]> = signal([]);

export const createAuditChartFilterStoreServiceMock = () => ({
  loadAuditChartFilterList: jest.fn(),
  loadAuditChartFilterCompanies: jest.fn(),
  loadAuditChartFilterServices: jest.fn(),
  loadAuditChartFilterSites: jest.fn(),
  updateAuditChartFilterByKey: jest.fn(),
  updateAuditChartFilterCompanies: jest.fn(),
  updateAuditChartFilterServices: jest.fn(),
  updateAuditChartFilterSites: jest.fn(),
  updateAuditChartFilterTimeRange: jest.fn(),
  dataCompanies,
  dataServices,
  dataSites,
  filterCompanies,
  filterServices,
  prefillSites,
  filterDateRange,
});
