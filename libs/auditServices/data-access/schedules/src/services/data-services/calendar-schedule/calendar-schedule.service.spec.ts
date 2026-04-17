import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { CalendarSchedulePayloadDto } from '../../../dtos';
import {
  CALENDAR_SCHEDULE_QUERY,
  SCHEDULE_CALENDAR_FILTER_COMPANIES,
  SCHEDULE_CALENDAR_FILTER_SERVICES,
  SCHEDULE_CALENDAR_FILTER_SITES,
  SCHEDULE_CALENDAR_FILTER_STATUSES,
} from '../../../graphql';
import { CalendarScheduleService } from './calendar-schedule.service';

describe('CalendarScheduleService', () => {
  const companies: number[] = [];
  const services: number[] = [];
  const sites: number[] = [];
  const statuses: number[] = [];
  let mockCalendarScheduleService: CalendarScheduleService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    mockCalendarScheduleService = new CalendarScheduleService(
      apolloMock as Apollo,
    );
  });

  test('should fetch and map - Calendar Schedule', (done) => {
    // Arrange
    const payload: CalendarSchedulePayloadDto = {
      month: 9,
      year: 2024,
      companies: [],
      services: [],
      sites: [],
      statuses: [],
    };
    const mockCalendarSchedule = {
      data: {
        viewAuditSchedules: {
          data: [
            {
              siteAuditId: 2,
              startDate: '2024-07-05T00:00:00.000+00:00',
              endDate: '2024-07-09T00:00:00.000+00:00',
              status: 'Confirmed',
              services: ['ISO 540001:2018'],
              site: 'Opentech (NZ)',
              city: 'Auckland',
              auditType: 'Initial Audit',
              leadAuditor: 'Arne Arnesson',
              siteAddress: 'Site Address 1',
              siteRepresentatives: ['Jessie McGrath'],
              company: 'Opentech',
            },
          ],
          message: '',
          isSuccess: true,
        },
      },
      loading: false,
      networkStatus: 7,
    };

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          viewAuditSchedules: mockCalendarSchedule,
        },
      }),
    );

    // Act
    mockCalendarScheduleService
      .getCalendarSchedule(payload)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: CALENDAR_SCHEDULE_QUERY,
          variables: {
            calendarScheduleFilter: {
              month: payload.month,
              year: payload.year,
              companies: [],
              services: [],
              sites: [],
              statuses: [],
            },
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockCalendarSchedule);
        done();
      });
  });

  test('should fetch and handle incorrect data - Calendar Schedule', (done) => {
    // Arrange
    const payload: CalendarSchedulePayloadDto = {
      month: 9,
      year: 2024,
      companies: [],
      services: [],
      sites: [],
      statuses: [],
    };
    apolloMock.query = jest.fn().mockReturnValue(of(undefined));

    // Act
    mockCalendarScheduleService
      .getCalendarSchedule(payload)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: CALENDAR_SCHEDULE_QUERY,
          variables: {
            calendarScheduleFilter: {
              month: payload.month,
              year: payload.year,
              companies: [],
              services: [],
              sites: [],
              statuses: [],
            },
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(undefined);
        done();
      });
  });

  test('should fetch and map - Calendar Filter Companies', (done) => {
    // Arrange
    const mockScheduleCalendarFilterCompaniesResponse = {
      data: {
        calendarCompaniesFilter: {
          data: [
            {
              id: 386,
              label: 'Air Products (BR) Limited',
            },
          ],
          message: '',
          isSuccess: true,
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          calendarCompaniesFilter: mockScheduleCalendarFilterCompaniesResponse,
        },
      }),
    );

    // Act
    mockCalendarScheduleService
      .getScheduleCalendarFilterCompanies(services, sites, statuses)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: SCHEDULE_CALENDAR_FILTER_COMPANIES,
          variables: {
            services,
            sites,
            statuses,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockScheduleCalendarFilterCompaniesResponse);
        done();
      });
  });

  test('should fetch and map - Calendar Filter Services', (done) => {
    // Arrange
    const mockScheduleCalendarFilterServicesResponse = {
      data: {
        calendarServicesFilter: {
          data: [
            {
              id: 1944,
              label: 'BRCGS - Additional COSTCO Requirements',
            },
          ],
          message: '',
          isSuccess: true,
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          calendarServicesFilter: mockScheduleCalendarFilterServicesResponse,
        },
      }),
    );

    // Act
    mockCalendarScheduleService
      .getScheduleCalendarFilterServices(companies, sites, statuses)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: SCHEDULE_CALENDAR_FILTER_SERVICES,
          variables: {
            companies,
            sites,
            statuses,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockScheduleCalendarFilterServicesResponse);
        done();
      });
  });

  test('should fetch and map - Calendar Filter Sites', (done) => {
    // Arrange
    const mockScheduleCalendarFilterSitesResponse = {
      data: {
        calendarSitesFilter: {
          data: [
            {
              id: 268,
              label: 'Australia',
              children: [
                {
                  id: 1,
                  label: 'Banksmeadow',
                },
              ],
            },
          ],
          message: '',
          isSuccess: true,
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          calendarSitesFilter: mockScheduleCalendarFilterSitesResponse,
        },
      }),
    );

    // Act
    mockCalendarScheduleService
      .getScheduleCalendarFilterSites(companies, services, statuses)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: SCHEDULE_CALENDAR_FILTER_SITES,
          variables: {
            companies,
            services,
            statuses,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockScheduleCalendarFilterSitesResponse);
        done();
      });
  });

  test('should fetch and map - Calendar Filter Statuses', (done) => {
    // Arrange
    const mockScheduleCalendarFilterStatusesResponse = {
      data: {
        calendarStatusesFilter: {
          data: [
            {
              id: 6,
              label: 'Completed',
            },
          ],
          message: '',
          isSuccess: true,
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: {
          calendarStatusesFilter: mockScheduleCalendarFilterStatusesResponse,
        },
      }),
    );

    // Act
    mockCalendarScheduleService
      .getScheduleCalendarFilterStatuses(companies, services, sites)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: SCHEDULE_CALENDAR_FILTER_STATUSES,
          variables: {
            companies,
            services,
            sites,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockScheduleCalendarFilterStatusesResponse);
        done();
      });
  });
});
