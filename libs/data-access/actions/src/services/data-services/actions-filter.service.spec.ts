import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import {
  ACTION_CATEGORY_FILTER_QUERY,
  ACTION_COMPANY_FILTER_QUERY,
  ACTION_SERVICES_FILTER_QUERY,
  ACTION_SITES_FILTER_QUERY,
} from '../../graphql';
import { ActionsFilterService } from './actions-filter.service';

describe('ActionsFilterService', () => {
  let service: ActionsFilterService;
  let apolloMock: any;

  beforeEach(() => {
    apolloMock = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: apolloMock }],
    });
    service = TestBed.inject(ActionsFilterService);
  });

  test('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  test('should call getActionFilterCategories and return expected data', (done) => {
    // Arrange
    const mockResponse = {
      data: { actionCategoriesFilter: { someData: 'test' } },
    };
    apolloMock.query.mockReturnValue(of(mockResponse));

    // Act
    service.getActionFilterCategories([1], [2], [3]).subscribe((result) => {
      // Assert
      expect(result).toEqual({ someData: 'test' });
      expect(apolloMock.use).toHaveBeenCalledWith('notification');
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: ACTION_CATEGORY_FILTER_QUERY,
        variables: {
          companies: [1],
          services: [2],
          sites: [3],
        },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });

  test('should call getActionFilterServices and return expected data', (done) => {
    // Arrange
    const mockResponse = {
      data: { actionServicesFilter: { service: 'testService' } },
    };
    apolloMock.query.mockReturnValue(of(mockResponse));

    // Act
    service.getActionFilterServices([1], [2], [3]).subscribe((result) => {
      // Assert
      expect(result).toEqual({ service: 'testService' });
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: ACTION_SERVICES_FILTER_QUERY,
        variables: {
          companies: [1],
          categories: [2],
          sites: [3],
        },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });

  test('should call getActionFilterCompanies and return expected data', (done) => {
    // Arrange
    const mockResponse = {
      data: { actionCompaniesFilter: { company: 'testCompany' } },
    };
    apolloMock.query.mockReturnValue(of(mockResponse));

    // Act
    service.getActionFilterCompanies([1], [2], [3]).subscribe((result) => {
      // Assert
      expect(result).toEqual({ company: 'testCompany' });
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: ACTION_COMPANY_FILTER_QUERY,
        variables: {
          categories: [1],
          services: [2],
          sites: [3],
        },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });

  test('should call getActionSites and return expected data', (done) => {
    // Arrange
    const mockResponse = { data: { actionSitesFilter: { site: 'testSite' } } };
    apolloMock.query.mockReturnValue(of(mockResponse));
    // Act
    service.getActionFilterSites([1], [2], [3]).subscribe((result) => {
      // Assert
      expect(result).toEqual({ site: 'testSite' });
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: ACTION_SITES_FILTER_QUERY,
        variables: { companies: [1], categories: [2], services: [3] },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });
});
