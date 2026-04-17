import { signal } from '@angular/core';

import { FilterOptions } from '@customer-portal/shared';

import { AuditDetailsModel, AuditDocumentListItemModel } from '../models';

export const createAuditDetailsStoreServiceMock = () => ({
  auditDetails: signal<AuditDetailsModel>({
    auditNumber: 1,
    header: {
      status: 'open',
      services: 'services',
      siteName: 'SiteName',
      siteAddress: 'Address',
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-07-01T00:00:00Z',
      auditor: 'AuditorLead',
      auditorTeam: [],
      auditPlanDocId: [123],
      auditReportDocId: [234],
    },
  }),
  auditId: signal<string>('1'),
  loadAuditDocumentsList: jest.fn(),
  auditDocumentsList: signal<AuditDocumentListItemModel[]>([]),
  auditDocumentsFilterOptions: signal<FilterOptions>({}),
  auditDocumentsTotalRecords: signal(1),
  auditDocumentsHasActiveFilters: signal(false),
  updateAuditDocumentsListGridConfig: jest.fn(),
  loadAuditDetails: jest.fn(),
  resetAuditDetailsState: jest.fn(),
  loadAuditFindingsList: jest.fn(),
  exportAuditFindingsExcel: jest.fn(),
  updateAuditFindingListGridConfig: jest.fn(),
  loadSitesList: jest.fn(),
  updateSitesListGridConfig: jest.fn(),
  loadSubAuditList: jest.fn(),
  exportSubAuditsExcel: jest.fn(),
  updateSubAuditGridConfig: jest.fn(),
  auditFindingHasActiveFilters: signal(false),
  siteItemsHasActiveFilters: signal(false),
  subAuditHasActiveFilters: signal(false),
});
