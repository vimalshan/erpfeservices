import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { AUDIT_DAYS_MOCKED_RESPONSE_DATA } from '../../__mocks__';
import { AUDIT_DAYS_GRID_QUERY } from '../../graphql';
import { AuditDaysGridService } from './audit-days-grid.service';

describe('AuditDaysGridService', () => {
  let service: AuditDaysGridService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    service = new AuditDaysGridService(apolloMock as Apollo);
  });

  test('should return audits days grid data', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companies: number[] = [];
    const services: number[] = [];
    const sites: number[] = [];
    apolloMock.query = jest
      .fn()
      .mockReturnValue(of(AUDIT_DAYS_MOCKED_RESPONSE_DATA));

    // Act
    service
      .getAuditDaysGridData(startDate, endDate, companies, services, sites)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_DAYS_GRID_QUERY,
          variables: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        });
        expect(result).toEqual(
          AUDIT_DAYS_MOCKED_RESPONSE_DATA.data.getAuditDaysPerSite,
        );
        done();
      });
  });
});
