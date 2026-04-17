import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { initialCardsMock } from '../../__mocks__';
import { OverviewService } from './overview.service';

describe('OverviewService', () => {
  let service: OverviewService;
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    service = new OverviewService(apolloMock as Apollo);
  });

  test('should get overview card data', () => {
    // Arrange
    apolloMock.query = jest.fn().mockReturnValue(of(initialCardsMock));

    // Act
    service.getOverviewCardData(1, [], [], []).subscribe((result) => {
      // Assert
      expect(result).toEqual(initialCardsMock);
    });
  });
});
