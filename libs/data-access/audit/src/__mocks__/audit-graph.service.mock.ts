import { of } from 'rxjs';

export const createAuditGraphServiceMock = () => ({
  getAuditStatusDoughnutGraphData: jest.fn(() => of({})),
  getAuditStatusBarGraphData: jest.fn(() => of({})),
  getAuditDaysDoughnutGraphData: jest.fn(() => of({})),
  getAuditDaysBarGraphData: jest.fn(() => of({})),
  getAuditGraphsFilterCompanies: jest.fn(),
  getAuditGraphsFilterServices: jest.fn(),
  getAuditGraphsFilterSites: jest.fn(),
});
