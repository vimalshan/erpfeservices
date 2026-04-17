import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { OVERVIEW_FINANCIAL_STATUS_QUERY } from '../../graphql';
import { OverviewFinancialStatusService } from './overview-financial-status.service';

describe('OverviewFinancialStatusService', () => {
  let mockOverviewFinancialStatusService: OverviewFinancialStatusService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    mockOverviewFinancialStatusService = new OverviewFinancialStatusService(
      apolloMock as Apollo,
    );
  });

  test('should fetch and handle correct data - Overview Financial Widget', (done) => {
    // Arrange
    const mockOverviewFinancialWidgetData = [
      {
        financialStatus: 'Not Paid',
        financialCount: 0,
        financialpercentage: 0,
      },
      {
        financialStatus: 'Overdue',
        financialCount: 10,
        financialpercentage: 0,
      },
      {
        financialStatus: 'Paid',
        financialCount: 0,
        financialpercentage: 0,
      },
    ];

    const mockResponse = {
      getWidgetforFinancials: {
        data: mockOverviewFinancialWidgetData,
        isSuccess: true,
      },
    };

    apolloMock.query = jest.fn().mockReturnValue(
      of({
        data: mockResponse,
      }),
    );

    // Act
    mockOverviewFinancialStatusService
      .getOverviewFinancialWidget()
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: OVERVIEW_FINANCIAL_STATUS_QUERY,
          variables: {},
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockResponse);
        done();
      });
  });

  test('should fetch and handle incorrect data - Overview Financial Widget', (done) => {
    // Arrange
    apolloMock.query = jest.fn().mockReturnValue(of(undefined));

    // Act
    mockOverviewFinancialStatusService
      .getOverviewFinancialWidget()
      .subscribe((result) => {
        // Assert
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: OVERVIEW_FINANCIAL_STATUS_QUERY,
          variables: {},
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(undefined);
        done();
      });
  });
});
