import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { AuditExcelPayloadDto } from '../../dtos';
import { AUDIT_LIST_QUERY } from '../../graphql';
import { AuditListService } from './audit-list.service';

describe('AuditListService', () => {
  let service: AuditListService;
  const mockedByteArray = [1, 2, 3];
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  const httpMock: Partial<HttpClient> = {
    post: jest.fn(),
  };

  beforeEach(() => {
    service = new AuditListService(
      apolloMock as Apollo,
      httpMock as HttpClient,
    );
  });

  test('should fetch and map audit list data', (done) => {
    // Arrange
    const viewAudits = [123, 234];
    (apolloMock.query as jest.Mock).mockReturnValue(
      of({
        data: {
          viewAudits,
        },
      }),
    );

    // Act
    service.getAuditList().subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: AUDIT_LIST_QUERY,
      });
      expect(result).toBe(viewAudits);
      done();
    });
  });

  test('should fetch and map audit excel data', (done) => {
    // Arrange
    const payload: AuditExcelPayloadDto = {
      filters: {
        auditId: [123],
        country: [],
        city: [],
        companyName: [],
        endDate: null,
        leadAuditor: [],
        service: [],
        site: [],
        startDate: null,
        status: [],
        type: [],
      },
    };
    (httpMock.post as jest.Mock).mockReturnValue(of({ data: mockedByteArray }));

    // Act
    service.exportAuditsExcel(payload).subscribe((result) => {
      // Assert
      expect(httpMock.post).toHaveBeenCalledWith(
        expect.stringContaining('/ExportAudits'),
        { filters: payload.filters },
      );
      expect(result).toEqual(mockedByteArray);
      done();
    });
  });

  test('should evict cache if audit list query fails or returns unsuccessful response', (done) => {
    // Arrange
    const viewAudits = { isSuccess: false };
    const evictSpy = jest
      .spyOn(service as any, 'evictFromCache')
      .mockImplementation(() => {});
    (apolloMock.query as jest.Mock).mockReturnValue(
      of({
        data: { viewAudits },
        errors: undefined,
      }),
    );

    // Act
    service.getAuditList().subscribe((result) => {
      // Assert
      expect(evictSpy).toHaveBeenCalled();
      expect(result).toEqual(viewAudits);
      done();
    });
  });
});
