import { of } from 'rxjs';

import { FindingsTrendsGraphDto } from '../dtos';

export const createFindingGraphServiceMock = () => ({
  getFindingStatusByCategoryGraphData: jest.fn(() => of({})),
  getFindingsByStatusGraphData: jest.fn(() => of({})),
  getFindingsTrendsGraphData: jest.fn(() =>
    of({} as unknown as FindingsTrendsGraphDto),
  ),
  getFindingsTrendsData: jest.fn(),
  getOpenFindingsGraphData: jest.fn(() => of({})),
  getFindingGraphsFilterCompanies: jest.fn(),
  getFindingGraphsFilterServices: jest.fn(),
  getFindingGraphsFilterSites: jest.fn(),
  getFindingsByClauseList: jest.fn(() => of({})),
  getFindingsBySiteList: jest.fn(() => of({})),
});
