import { of } from 'rxjs';

export const createAuditDaysGridServiceMock = () => ({
  getAuditDaysGridData: jest.fn(() => of({})),
});
