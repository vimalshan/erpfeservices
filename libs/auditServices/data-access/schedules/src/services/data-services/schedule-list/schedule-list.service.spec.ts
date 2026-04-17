import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { ScheduleExcelPayloadDto } from '../../../dtos';
import { SCHEDULE_LIST_QUERY } from '../../../graphql';
import { ScheduleListService } from './schedule-list.service';

describe('ScheduleListService', () => {
  let service: ScheduleListService;

  const mockedByteArray = [1, 2, 3];
  const viewAuditSchedules = [1, 2, 3];

  let apolloQueryMock: jest.Mock;
  let apolloUseMock: jest.Mock;
  let apolloMock: Partial<Apollo>;

  const httpPostMock = jest.fn();
  const httpMock: Partial<HttpClient> = {
    post: httpPostMock,
  };

  beforeEach(() => {
    apolloQueryMock = jest.fn().mockReturnValue(
      of({
        data: {
          viewAuditSchedules,
        },
      }),
    );
    apolloUseMock = jest.fn().mockReturnValue({ query: apolloQueryMock });

    apolloMock = {
      use: apolloUseMock,
    };

    service = new ScheduleListService(
      apolloMock as Apollo,
      httpMock as HttpClient,
    );
  });

  test('should fetch and map schedule list data', (done) => {
    // Arrange
    const expectedQuery = {
      query: SCHEDULE_LIST_QUERY,
      variables: { calendarScheduleFilter: {} },
      fetchPolicy: 'no-cache',
    };

    // Act
    service.getScheduleList().subscribe((result) => {
      // Assert
      expect(apolloUseMock).toHaveBeenCalledWith('schedule');
      expect(apolloQueryMock).toHaveBeenCalledWith(expectedQuery);
      expect(result).toEqual(viewAuditSchedules);
      done();
    });
  });

  test('should fetch and map certificate excel data', (done) => {
    // Arrange
    const payload: ScheduleExcelPayloadDto = {
      filters: {
        startDate: [],
        endDate: [],
        status: ['Confirmed'],
        service: [],
        site: [],
        city: [],
        auditType: [],
        leadAuditor: [],
        siteRepresentative: [],
        company: [],
        siteAuditId: [],
      },
    };

    httpPostMock.mockReturnValue(of({ data: mockedByteArray }));

    // Act
    service.exportSchedulesExcel(payload).subscribe((result) => {
      // Assert
      expect(httpPostMock).toHaveBeenCalledWith(
        expect.stringContaining('/ExportAuditSchedules'),
        { filters: payload.filters },
      );
      expect(result).toEqual(mockedByteArray);
      done();
    });
  });
});
