import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import {
  OVERVIEW_FILTER_COMPANIES_QUERY,
  OVERVIEW_FILTER_SERVICES_QUERY,
  OVERVIEW_FILTER_SITES_QUERY,
} from '../../graphql';
import { OverviewFilterService } from './overview-filter.service';

describe('OverviewFilterService', () => {
  const companies: number[] = [];
  const services: number[] = [];
  const sites: number[] = [];
  let mockOverviewFilterService: OverviewFilterService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    mockOverviewFilterService = new OverviewFilterService(apolloMock as Apollo);
  });

  test('should fetch and map - Overview Filter Companies', (done) => {
    // Arrange
    const mockOverviewFilterCompaniesResponse = {
      data: {
        certificateCompaniesFilter: {
          data: [
            {
              id: 1,
              label: 'Rabbit',
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
          certificateCompaniesFilter: mockOverviewFilterCompaniesResponse,
        },
      }),
    );

    // Act
    mockOverviewFilterService
      .getOverviewFilterCompanies(services, sites)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: OVERVIEW_FILTER_COMPANIES_QUERY,
          variables: {
            services,
            sites,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockOverviewFilterCompaniesResponse);
        done();
      });
  });

  test('should fetch and map - Overview Filter Services', (done) => {
    // Arrange
    const mockOverviewFilterServicesResponse = {
      data: {
        certificateServicesFilter: {
          data: [
            {
              id: 2,
              label: 'Fox',
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
          certificateServicesFilter: mockOverviewFilterServicesResponse,
        },
      }),
    );

    // Act
    mockOverviewFilterService
      .getOverviewFilterServices(companies, sites)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: OVERVIEW_FILTER_SERVICES_QUERY,
          variables: {
            companies,
            sites,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockOverviewFilterServicesResponse);
        done();
      });
  });

  test('should fetch and map - Overview Filter Sites', (done) => {
    // Arrange
    const mockOverviewFilterSitesResponse = {
      data: {
        certificationSitesFilter: {
          data: [
            {
              id: 3,
              label: 'Bear',
              children: [
                {
                  id: 4,
                  label: 'Wolf',
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
          certificationSitesFilter: mockOverviewFilterSitesResponse,
        },
      }),
    );

    // Act
    mockOverviewFilterService
      .getOverviewFilterSites(companies, services)
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: OVERVIEW_FILTER_SITES_QUERY,
          variables: {
            companies,
            services,
          },
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockOverviewFilterSitesResponse);
        done();
      });
  });
});
