import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import {
  NOTIFICATION_CATEGORY_FILTER_QUERY,
  NOTIFICATION_COMPANY_FILTER_QUERY,
  NOTIFICATION_SERVICES_FILTER_QUERY,
  NOTIFICATION_SITES_FILTER_QUERY,
} from '../../../graphql';
import { NotificationFilterService } from './notification-filter.service';

describe('NotificationFilterService', () => {
  let service: NotificationFilterService;
  let apolloMock: any;

  beforeEach(() => {
    apolloMock = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationFilterService,
        { provide: Apollo, useValue: apolloMock },
      ],
    });
    service = TestBed.inject(NotificationFilterService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should call getNotificationCategory and return expected data', (done) => {
    // Arrange
    const mockResponse = {
      data: { categoriesFilter: { someData: 'test' } },
    };
    apolloMock.query.mockReturnValue(of(mockResponse));

    // Act
    service.getNotificationCategory().subscribe((result) => {
      // Assert
      expect(result).toEqual({ someData: 'test' });
      expect(apolloMock.use).toHaveBeenCalledWith('notification');
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: NOTIFICATION_CATEGORY_FILTER_QUERY,
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });

  test('should call getNotificationServices and return expected data', (done) => {
    // Arrange
    const mockResponse = {
      data: { servicesFilter: { service: 'testService' } },
    };
    apolloMock.query.mockReturnValue(of(mockResponse));

    // Act
    service.getNotificationServices(['1'], ['2'], ['3']).subscribe((result) => {
      // Assert
      expect(result).toEqual({ service: 'testService' });
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: NOTIFICATION_SERVICES_FILTER_QUERY,
        variables: {
          categories: ['1'],
          companies: ['2'],
          sites: ['3'],
        },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });

  test('should call getNotificationCompany and return expected data', (done) => {
    // Arrange
    const mockResponse = {
      data: { companiesFilter: { company: 'testCompany' } },
    };
    apolloMock.query.mockReturnValue(of(mockResponse));

    // Act
    service.getNotificationCompany(['1'], ['2'], ['3']).subscribe((result) => {
      // Assert
      expect(result).toEqual({ company: 'testCompany' });
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: NOTIFICATION_COMPANY_FILTER_QUERY,
        variables: {
          categories: ['1'],
          services: ['2'],
          sites: ['3'],
        },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });

  test('should call getNotificationSites and return expected data', (done) => {
    // Arrange
    const mockResponse = { data: { sitesFilter: { site: 'testSite' } } };
    apolloMock.query.mockReturnValue(of(mockResponse));
    // Act
    service.getNotificationSites([1], [2], [3]).subscribe((result) => {
      // Assert
      expect(result).toEqual({ site: 'testSite' });
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: NOTIFICATION_SITES_FILTER_QUERY,
        variables: { companies: [1], categories: [2], services: [3] },
        fetchPolicy: 'no-cache',
      });
      done();
    });
  });
});
