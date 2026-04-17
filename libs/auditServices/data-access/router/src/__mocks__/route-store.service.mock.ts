import { of } from 'rxjs';

export const mockeddAuditId = 'audit_id';

export const createRouteStoreServiceMock = () => ({
  getPathParamByKey: jest.fn().mockReturnValue(of(mockeddAuditId)),
});
