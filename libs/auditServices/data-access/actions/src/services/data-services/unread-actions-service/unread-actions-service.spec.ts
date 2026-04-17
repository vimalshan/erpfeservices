import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { UnreadActionsCountDto } from '../../../dtos';
import { ACTIONS_COUNT_QUERY } from '../../../graphql';
import { UnreadActionsService } from './unread-actions-service';

describe('UnreadActionsService', () => {
  let service: UnreadActionsService;
  let apolloMock: Partial<Apollo>;

  beforeEach(() => {
    apolloMock = {
      use: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UnreadActionsService,
        { provide: Apollo, useValue: apolloMock },
      ],
    });

    service = TestBed.inject(UnreadActionsService);
    apolloMock = TestBed.inject(Apollo);
  });

  test('should return unread actions count', (done) => {
    // Arrange
    const mockedResponse: UnreadActionsCountDto = {
      data: 20,
      errorCode: '0001',
      isSuccess: true,
      message: 'tesst message',
    };
    apolloMock.query = jest.fn().mockReturnValueOnce(of(mockedResponse));

    // Act
    service.getUnreadActionsCount().subscribe((result) => {
      // Assert
      expect(apolloMock.use).toHaveBeenCalledWith('notification');
      expect(apolloMock.query).toHaveBeenCalledWith({
        query: ACTIONS_COUNT_QUERY,
        fetchPolicy: 'no-cache',
      });
      expect(result).toEqual(mockedResponse.data);
      done();
    });
  });
});
