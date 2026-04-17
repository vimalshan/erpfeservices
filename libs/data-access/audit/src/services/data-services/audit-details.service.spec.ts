import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';

import {
  AuditDetailsDto,
  AuditFindingListItemDto,
  AuditFindingsExcelPayloadDto,
  AuditSiteListItemDto,
  SubAuditExcelPayloadDto,
  SubAuditListItemDto,
} from '../../dtos';
import {
  AUDIT_DETAILS_QUERY,
  AUDIT_FINDING_LIST_QUERY,
  AUDIT_SITES_LIST_QUERY,
  EXPORT_AUDIT_FINDINGS_EXCEL_QUERY,
  SUB_AUDIT_LIST_QUERY,
} from '../../graphql';
import { AuditDetailsService } from './audit-details.service';

describe('AuditDetailsService', () => {
  let service: AuditDetailsService;
  const mockedByteArray = [1, 2, 3];
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  const httpMock: Partial<HttpClient> = {
    post: jest.fn(),
  };

  jest.mock('@customer-portal/environments', () => ({
    environment: {
      documentsApi: 'http://fakeapi.com',
    },
  }));

  beforeEach(() => {
    service = new AuditDetailsService(
      apolloMock as Apollo,
      httpMock as HttpClient,
    );
  });

  test('should call getAuditFindingList with correct parameters', (done) => {
    // Arrange
    const auditId = 1;

    const viewFindings: AuditFindingListItemDto[] = [
      {
        findingsId: '123',
        findingNumber: 'MANMES-0031',
        category: 'Incident',
        companyName: 'Company 1',
        status: 'Open',
        title: 'Major security vulnerability found',
        services: ['OWASP Top 10', 'NIST 800-53'],
        sites: ['Site 1', 'Site 2'],
        cities: ['San Francisco', 'Bucharest'],
        auditId: '2024001',
        openDate: '2024-06-15T08:00:00Z',
        dueDate: '2024-06-30T08:00:00Z',
        closedDate: '2024-07-05T08:00:00Z',
        acceptedDate: '2024-07-10T08:00:00Z',
      },
    ];

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          viewFindings,
        },
      }),
    );

    // Act
    service.getAuditFindingList(auditId).subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: AUDIT_FINDING_LIST_QUERY,
        variables: {
          auditId,
        },
      });
      expect(result).toBe(viewFindings);
      done();
    });
  });

  test('should call exportAuditFindingsExcel with correct parameters', (done) => {
    // Arrange
    const payload: AuditFindingsExcelPayloadDto = {
      filters: {
        findings: [],
        status: [],
        title: [],
        category: [],
        companyName: [],
        service: [],
        city: [],
        site: [],
        openDate: [],
        dueDate: [],
        acceptedDate: [],
        closeDate: [],
        audit: [],
        auditId: [],
      },
    };

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          exportFindings: {
            data: mockedByteArray,
          },
        },
      }),
    );

    // Act
    service.exportAuditFindingsExcel(payload).subscribe((result) => {
      // Assert
      expect(apolloMock.use).toHaveBeenCalledWith('finding');
      expect(apolloMock.query).toHaveBeenCalled();
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: EXPORT_AUDIT_FINDINGS_EXCEL_QUERY,
        variables: payload,
      });
      expect(result).toEqual(mockedByteArray);
      done();
    });
  });

  test('should call getSubAuditList with correct parameters', (done) => {
    // Arrange
    const auditId = 1;

    const subAudits: SubAuditListItemDto[] = [
      {
        auditId: 3067121,
        cities: ['Nordstemmen'],
        sites: ['Calenberger Strasse 36'],
        services: ['IFS Food version 8 April 2023'],
        status: 'Findings to be managed',
        startDate: '2023-09-17T14:08:10.207+00:00',
        endDate: '2024-05-16T14:08:10.207+00:00',
        auditorTeam: ['John'],
      },
    ];

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          viewSubAudits: subAudits,
        },
      }),
    );

    // Act
    service.getSubAuditList(auditId).subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: SUB_AUDIT_LIST_QUERY,
        variables: {
          auditId,
        },
      });
      expect(result).toBe(subAudits);
      done();
    });
  });

  test('should call exportSubAuditsExcel with correct parameters', (done) => {
    // Arrange
    const payload: SubAuditExcelPayloadDto = {
      auditId: 1,
      filters: {
        city: [],
        sites: [],
        service: [],
        status: [],
        startDate: [],
        endDate: [],
        auditorTeam: [],
      },
    };

    const expectedUrl = `${service['exportSubAuditExcelUrl']}?auditId=${payload.auditId}`;
    (httpMock.post as jest.Mock).mockReturnValue(of({ data: mockedByteArray }));

    // Act
    service.exportSubAuditsExcel(payload).subscribe((result) => {
      // Assert
      expect(httpMock.post).toHaveBeenCalledWith(expectedUrl, payload.filters);
      expect(result).toEqual(mockedByteArray);

      done();
    });
  });

  test('should get audit details', (done) => {
    // Arrange
    const auditId = 123;
    const auditDetails: AuditDetailsDto = {
      data: {
        auditId: 123,
        status: 'open',
        services: ['Service1', 'Service2'],
        siteName: 'SiteName',
        siteAddress: 'Address',
        startDate: '2024-06-01T00:00:00Z',
        endDate: '2024-07-01T00:00:00Z',
        leadAuditor: 'AuditorLead',
        auditorTeam: ['Auditor 1', 'Auditor 2'],
      },
      isSuccess: true,
    };

    apolloMock.query = jest.fn().mockReturnValueOnce(
      of({
        data: {
          auditDetails,
        },
      }),
    );

    // Act
    service.getAuditDetails(auditId).subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: AUDIT_DETAILS_QUERY,
        variables: {
          auditId,
        },
      });
      expect(result).toBe(auditDetails);
      done();
    });
  });

  test('should get audit list data', (done) => {
    // Arrange
    const auditId = 333;
    const auditSites: AuditSiteListItemDto[] = [
      {
        siteName: 'name',
        addressLine: 'address',
        city: 'city',
        country: 'country',
        postCode: 'code',
      },
    ];
    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          viewSitesForAudit: {
            data: auditSites,
          },
        },
      }),
    );

    // Act
    service.getSitesList(auditId).subscribe((result) => {
      // Assert
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: AUDIT_SITES_LIST_QUERY,
        variables: {
          auditId,
        },
      });
      expect(result.data).toBe(auditSites);
      done();
    });
  });

  test('should handle error in getAuditFindingList', (done) => {
    const auditId = 1;
    const errorResponse = { message: 'GraphQL error' };

    apolloMock.query = jest
      .fn()
      .mockReturnValueOnce(throwError(() => errorResponse));

    service.getAuditFindingList(auditId).subscribe({
      next: () => fail('Expected error, got success'),
      error: (err) => {
        expect(err).toBe(errorResponse);
        done();
      },
    });
  });
});
