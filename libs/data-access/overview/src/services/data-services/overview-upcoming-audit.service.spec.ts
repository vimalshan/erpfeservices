import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { OverviewUpcomingAuditEvent } from '../../models/overview-upcoming-audit.model';
import { OverviewUpcomingAuditService } from './overview-upcoming-audit.service';

describe('OverviewUpcomingAuditService', () => {
  let service: OverviewUpcomingAuditService;
  let httpMock: HttpTestingController;
  const apolloMock = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OverviewUpcomingAuditService,
        { provide: Apollo, useValue: apolloMock },
      ],
    });
    service = TestBed.inject(OverviewUpcomingAuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get overview audit events', () => {
    // Arrange
    const mockData: OverviewUpcomingAuditEvent[] = [
      {
        title: 'Confirmed',
        start: '2025-01-23',
        end: '2025-01-23',
        color: '#3F9C35',
      },
      {
        title: 'To Be Confirmed',
        start: '2025-01-23',
        end: '2025-01-23',
        color: '#FFE900',
      },
      {
        title: 'To Be Confirmed',
        start: '2025-01-24',
        end: '2025-01-24',
        color: '#FFE900',
      },
      {
        title: 'To Be Confirmed by DNV',
        start: '2025-01-25',
        end: '2025-01-25',
        color: '#009FDA',
      },
    ];
    apolloMock.query = jest.fn().mockReturnValue(of(mockData));

    // Act
    service.getOverviewUpcomingAuditEvents(4, 2025).subscribe((result) => {
      // Assert
      expect(result).toEqual(mockData);
    });
  });
});
