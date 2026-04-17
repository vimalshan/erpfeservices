import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { OpenFindingsMonthsPeriod } from '../../models';
import { FindingGraphsService } from './finding-graphs.service';

describe('FindingGraphsService', () => {
  let service: FindingGraphsService;
  let apollo: Apollo;

  beforeEach(() => {
    const apolloMock = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        FindingGraphsService,
        { provide: Apollo, useValue: apolloMock },
      ],
    });

    service = TestBed.inject(FindingGraphsService);
    apollo = TestBed.inject(Apollo);
  });

  test('should return finding status by category graph data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        findingsCategoryStats: [{ category: 'Category1', count: 10 }],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const companies = [1, 2];
    const services = [1];
    const sites = [1, 2, 3];

    // Act
    const result$ = service.getFindingStatusByCategoryGraphData(
      startDate,
      endDate,
      companies,
      services,
      sites,
    );

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.findingsCategoryStats);
      done();
    });
  });

  test('should return findings by status graph data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        findingsStatusStats: [{ status: 'Open', count: 15 }],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const companies = [1, 2];
    const services = [1];
    const sites = [1, 2, 3];

    // Act
    const result$ = service.getFindingsByStatusGraphData(
      startDate,
      endDate,
      companies,
      services,
      sites,
    );

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.findingsStatusStats);
      done();
    });
  });

  test('should return findings trends graph data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        findingsByCategory: [{ category: 'Category1', count: 20 }],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const companies = [1, 2];
    const services = [1];
    const sites = [1, 2, 3];

    // Act
    const result$ = service.getFindingsTrendsGraphData(
      companies,
      services,
      sites,
    );

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.findingsByCategory);
      done();
    });
  });

  test('should return findings trends data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        trendList: [{ trend: 'Trend1', value: 30 }],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const companies = [1, 2];
    const services = [1];
    const sites = [1, 2, 3];

    // Act
    const result$ = service.getFindingsTrendsData(companies, services, sites);

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.trendList);
      done();
    });
  });

  test('should return open findings graph data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        getOpenFindingschartviewData: [{ month: 'January', count: 10 }],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const period: OpenFindingsMonthsPeriod =
      OpenFindingsMonthsPeriod.BecomingOverdue;
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const companies = [1, 2];
    const services = [1];
    const sites = [1, 2, 3];
    const responsetype = 'summary';

    // Act
    const result$ = service.getOpenFindingsGraphData(
      period,
      startDate,
      endDate,
      companies,
      services,
      sites,
      responsetype,
    );

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.getOpenFindingschartviewData);
      done();
    });
  });

  test('should return finding graphs filter companies data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        companiesFilter: [{ company: 'Company1', count: 5 }],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const services = [1];
    const sites = [1, 2, 3];

    // Act
    const result$ = service.getFindingGraphsFilterCompanies(
      startDate,
      endDate,
      services,
      sites,
    );

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.companiesFilter);
      done();
    });
  });

  test('should return finding graphs filter services data', (done) => {
    // Arrange
    const mockResponse: any = {
      data: {
        servicesFilter: ['service1', 'service2'],
      },
    };
    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const companies = [1, 2];
    const sites = [1, 2, 3];

    // Act
    const result$ = service.getFindingGraphsFilterServices(
      startDate,
      endDate,
      companies,
      sites,
    );

    // Assert
    result$.subscribe((data) => {
      expect(data).toEqual(mockResponse.data.servicesFilter);
      done();
    });
  });

  test('should fetch filtered sites data', (done) => {
    // Arrange
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-31');
    const companies = [1, 2, 3];
    const services = [4, 5, 6];
    const mockResponse: any = {
      data: {
        sitesFilter: ['site1', 'site2'],
      },
    };

    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    // Act
    const result$ = service.getFindingGraphsFilterSites(
      startDate,
      endDate,
      companies,
      services,
    );

    // Assert
    result$.subscribe((result) => {
      expect(result).toEqual(['site1', 'site2']);
      done();
    });
  });

  test('should return findings by clause data', (done) => {
    // Arrange
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-31');
    const companies = [1, 2, 3];
    const services = [4, 5, 6];
    const sites = [1, 2, 3];
    const mockResponse: any = {
      data: {
        findingsByClauseList: [
          {
            data: {
              finding: 'Australia',
              major: 40,
              minor: 60,
              observation: 48,
              toImprove: 12,
              total: 150,
            },
            children: [
              {
                data: {
                  finding: 'Adelaide',
                  major: 7,
                  minor: 0,
                  observation: 3,
                  toImprove: 0,
                  total: 10,
                },
                children: [
                  {
                    data: {
                      finding:
                        'ISS Health Services Pty Limited - Health Division (Adelaide)',
                      major: 33,
                      minor: 0,
                      observation: 3,
                      toImprove: 0,
                      total: 10,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    jest.spyOn(apollo, 'query').mockReturnValue(of(mockResponse));

    // Act
    const result$ = service.getFindingsByClauseList(
      startDate,
      endDate,
      companies,
      services,
      sites,
    );

    // Assert
    result$.subscribe((result) => {
      expect(result).toEqual(mockResponse.data.findingsByClauseList);
      done();
    });
  });
});
