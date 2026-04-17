import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { FindingExcelPayloadDto } from '../../dtos';
import { FINDING_LIST_QUERY } from '../../graphql/queries/finding-list.graphql';
import { FindingsListService } from './findings-list.service';

describe('FindingsListService', () => {
  let service: FindingsListService;
  const mockedByteArray = [1, 2, 3];
  const findings = [123, 234];

  // Mock query function
  const apolloQueryMock = jest.fn();

  // Mock use function that returns an object with 'query'
  const apolloUseMock = jest.fn().mockReturnValue({
    query: apolloQueryMock,
  });

  const apolloMock: Partial<Apollo> = {
    use: apolloUseMock,
  };

  const httpMock: Partial<HttpClient> = {
    post: jest.fn(),
  };

  beforeEach(() => {
    service = new FindingsListService(
      apolloMock as Apollo,
      httpMock as HttpClient,
    );
  });

  test('should fetch and map findings list data', (done) => {
    // Arrange
    apolloQueryMock.mockReturnValue(
      of({
        data: {
          viewFindings: findings,
        },
      }),
    );

    // Act
    service.getFindingList().subscribe((result) => {
      // Assert
      expect(apolloUseMock).toHaveBeenCalledWith('finding');
      expect(apolloQueryMock).toHaveBeenCalledWith({
        query: FINDING_LIST_QUERY,
      });
      expect(result).toEqual(findings);
      done();
    });
  });

  test('should fetch and map findings excel data', (done) => {
    // Arrange
    const payload: FindingExcelPayloadDto = {
      filters: {
        findings: [],
        findingsId: [],
        status: [],
        title: [],
        category: [],
        service: [],
        site: [],
        country: [],
        city: [],
        auditId: [],
        openDate: [],
        closedDate: [],
        acceptedDate: [],
        companyName: [],
      },
    };

    (httpMock.post as jest.Mock).mockReturnValue(of({ data: mockedByteArray }));

    // Act
    service.exportFindingsExcel(payload).subscribe((result) => {
      // Assert
      expect(httpMock.post).toHaveBeenCalledWith(
        expect.stringContaining('/ExportFindings'),
        { filters: payload.filters },
      );
      expect(result).toBe(mockedByteArray);
      done();
    });
  });
});
