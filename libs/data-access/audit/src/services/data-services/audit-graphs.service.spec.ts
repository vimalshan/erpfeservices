import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import {
  AUDIT_DAYS_BAR_CHART_DATA,
  AUDIT_DAYS_DOUGHNUT_CHART_DATA,
} from '../../__mocks__';
import {
  AUDIT_DAYS_BAR_CHART_QUERY,
  AUDIT_DAYS_DOUGHNUT_CHART_QUERY,
  AUDIT_GRAPHS_FILTER_COMPANIES_QUERY,
  AUDIT_GRAPHS_FILTER_SERVICES_QUERY,
  AUDIT_GRAPHS_FILTER_SITES_QUERY,
  AUDIT_STATUS_BAR_CHART_QUERY,
  AUDIT_STATUS_DOUGHNUT_CHART_QUERY,
} from '../../graphql';
import { AuditGraphsService } from './audit-graphs.service';

describe('AuditGraphsService', () => {
  let service: AuditGraphsService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    service = new AuditGraphsService(apolloMock as Apollo);
  });

  test('should return audits status doughnut graph data', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companies: number[] = [];
    const services: number[] = [];
    const sites: number[] = [];
    const mockedResponse = {
      data: {
        auditStatusStats: {
          data: {
            stats: [
              { status: 'Confirmed', count: 20, percent: 18.18 },
              { status: 'In progress', count: 50, percent: 45.45 },
              { status: 'To be confirmed', count: 14, percent: 12.73 },
              { status: 'Completed', count: 10, percent: 9.09 },
              { status: 'Finding open', count: 9, percent: 8.18 },
              { status: 'Cancelled', count: 7, percent: 6.36 },
            ],
            totalAudits: 110,
          },
        },
      },
    };

    apolloMock.query = jest.fn().mockReturnValue(of(mockedResponse));

    // Act
    service
      .getAuditStatusDoughnutGraphData(
        startDate,
        endDate,
        companies,
        services,
        sites,
      )
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_STATUS_DOUGHNUT_CHART_QUERY,
          variables: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        });
        expect(result).toEqual(mockedResponse.data.auditStatusStats);
        done();
      });
  });

  test('should return audits days doughnut graph data', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companies: number[] = [];
    const services: number[] = [];
    const sites: number[] = [];
    apolloMock.query = jest
      .fn()
      .mockReturnValue(of(AUDIT_DAYS_DOUGHNUT_CHART_DATA));

    // Act
    service
      .getAuditDaysDoughnutGraphData(
        startDate,
        endDate,
        companies,
        services,
        sites,
      )
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_DAYS_DOUGHNUT_CHART_QUERY,
          variables: {
            filters: {
              startDate,
              endDate,
              companies,
              services,
              sites,
            },
          },
        });
        expect(result).toEqual(
          AUDIT_DAYS_DOUGHNUT_CHART_DATA.data.auditDaysbyServicePieChart,
        );
        done();
      });
  });

  test('should return audits status bar graph data', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companies: number[] = [];
    const services: number[] = [];
    const sites: number[] = [];
    const mockedResponse = {
      data: {
        auditTypeStats: {
          data: {
            stats: [
              {
                type: 'Initial',
                statuses: [
                  {
                    status: 'Confirmed',
                    count: 8,
                  },
                  {
                    status: 'In progress',
                    count: 4,
                  },
                  {
                    status: 'To be confirmed',
                    count: 2,
                  },
                ],
              },
              {
                type: 'Periodic 1',
                statuses: [
                  {
                    status: 'Confirmed',
                    count: 5,
                  },
                  {
                    status: 'In progress',
                    count: 2,
                  },
                  {
                    status: 'To be confirmed',
                    count: 3,
                  },
                ],
              },
              {
                type: 'Periodic 2',
                statuses: [
                  {
                    status: 'Confirmed',
                    count: 3,
                  },
                  {
                    status: 'In progress',
                    count: 1,
                  },
                  {
                    status: 'To be confirmed',
                    count: 2,
                  },
                ],
              },
              {
                type: 'Recertification',
                statuses: [
                  {
                    status: 'Confirmed',
                    count: 1,
                  },
                  {
                    status: 'In progress',
                    count: 5,
                  },
                  {
                    status: 'To be confirmed',
                    count: 3,
                  },
                ],
              },
            ],
          },
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(of(mockedResponse));

    // Act
    service
      .getAuditStatusBarGraphData(
        startDate,
        endDate,
        companies,
        services,
        sites,
      )
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_STATUS_BAR_CHART_QUERY,
          variables: {
            startDate,
            endDate,
            companies,
            services,
            sites,
          },
        });
        expect(result).toEqual(mockedResponse.data.auditTypeStats);
        done();
      });
  });

  test('should return audits days bar graph data', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companyFilter: number[] = [];
    const serviceFilter: number[] = [];
    const siteFilter: number[] = [];
    apolloMock.query = jest.fn().mockReturnValue(of(AUDIT_DAYS_BAR_CHART_DATA));

    // Act
    service
      .getAuditDaysBarGraphData(
        startDate,
        endDate,
        companyFilter,
        serviceFilter,
        siteFilter,
      )
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_DAYS_BAR_CHART_QUERY,
          variables: {
            startDate,
            endDate,
            companyFilter,
            serviceFilter,
            siteFilter,
          },
        });
        expect(result).toEqual(
          AUDIT_DAYS_BAR_CHART_DATA.data.getAuditDaysByMonthAndService,
        );
        done();
      });
  });

  test('should return audits with companies filter', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const services: number[] = [];
    const sites: number[] = [];
    const mockedResponse: any = {
      data: {
        companiesFilter: {
          data: [
            {
              id: 1,
              label: 'ABC Technologies',
            },
            {
              id: 2,
              label: 'XYZ Solutions',
            },
            {
              id: 3,
              label: 'Global Innovations',
            },
            {
              id: 4,
              label: 'TechWave',
            },
            {
              id: 5,
              label: 'NextGen Systems',
            },
          ],
          isSuccess: true,
          message: '',
          errorCode: '',
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(of(mockedResponse));

    // Act
    service
      .getAuditGraphsFilterCompanies(startDate, endDate, services, sites)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_GRAPHS_FILTER_COMPANIES_QUERY,
          variables: {
            startDate,
            endDate,
            services,
            sites,
          },
        });
        expect(result).toEqual(mockedResponse.data.companiesFilter);
        done();
      });
  });

  test('should return audits with services filter', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companies: number[] = [];
    const sites: number[] = [];
    const mockedResponse: any = {
      data: {
        servicesFilter: {
          data: [
            {
              id: 11,
              label: 'ISO 14001:2015',
            },
            {
              id: 12,
              label: 'ISO 22000:2018',
            },
            {
              id: 13,
              label: 'ISO 27001:2013',
            },
            {
              id: 14,
              label: 'ISO 45001:2018',
            },
            {
              id: 15,
              label: 'ISO 540001:2018',
            },
          ],
          isSuccess: true,
          message: '',
          errorCode: '',
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(of(mockedResponse));

    // Act
    service
      .getAuditGraphsFilterServices(startDate, endDate, companies, sites)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_GRAPHS_FILTER_SERVICES_QUERY,
          variables: {
            startDate,
            endDate,
            companies,
            sites,
          },
        });
        expect(result).toEqual(mockedResponse.data.servicesFilter);
        done();
      });
  });

  test('should return audits with sites filter', (done) => {
    // Arrange
    const startDate: Date = new Date();
    const endDate: Date = new Date();
    const companies: number[] = [];
    const services: number[] = [];
    const mockedResponse: any = {
      data: {
        sitesFilter: {
          data: [
            {
              id: 31,
              label: 'Belgium',
              children: [
                {
                  id: 311,
                  label: 'Antwerp',
                  children: [
                    {
                      id: 3111,
                      label: 'Site 1',
                    },
                    {
                      id: 3112,
                      label: 'Site 2',
                    },
                  ],
                },
              ],
            },
            {
              id: 32,
              label: 'Italy',
              children: [
                {
                  id: 322,
                  label: 'Rome',
                  children: [
                    {
                      id: 3221,
                      label: 'Site 1',
                    },
                    {
                      id: 3222,
                      label: 'Site 2',
                    },
                  ],
                },
              ],
            },
          ],
          isSuccess: true,
          message: '',
          errorCode: '',
        },
      },
    };
    apolloMock.query = jest.fn().mockReturnValue(of(mockedResponse));

    // Act
    service
      .getAuditGraphsFilterSites(startDate, endDate, companies, services)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.use).toHaveBeenCalledWith('audit');
        expect(apolloMock.query).toHaveBeenCalled();
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: AUDIT_GRAPHS_FILTER_SITES_QUERY,
          variables: {
            startDate,
            endDate,
            companies,
            services,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toEqual(mockedResponse.data.sitesFilter);
        done();
      });
  });
});
