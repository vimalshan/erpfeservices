import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { UnreadNotificationsService } from './unread-notifications-service';

describe('NotificationListService', () => {
  let service: UnreadNotificationsService;
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    service = new UnreadNotificationsService(apolloMock as Apollo);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should return unread notifications count', (done) => {
    // Arrange
    const expectedData = {
      data: 4,
      isSuccess: true,
      message: '',
      errorCode: '',
    };

    jest
      .spyOn(service, 'getUnreadNotificationsCount')
      .mockReturnValue(of(expectedData));

    // Act
    service.getUnreadNotificationsCount().subscribe((unreadActions) => {
      const isSuccess = unreadActions?.isSuccess;
      const unreadActionsCount = unreadActions?.data;

      // Assert
      expect(isSuccess).toEqual(true);
      expect(unreadActionsCount).toEqual(4);
      done();
    });
  });

  test('should not return unread notifications count', (done) => {
    // Arrange
    const expectedData = {
      data: 0,
      isSuccess: false,
      message: '',
      errorCode: '',
    };

    jest
      .spyOn(service, 'getUnreadNotificationsCount')
      .mockReturnValue(of(expectedData));

    // Act
    service.getUnreadNotificationsCount().subscribe((unreadActions) => {
      const isSuccess = unreadActions?.isSuccess;

      // Assert
      expect(isSuccess).toEqual(false);
      done();
    });
  });
});
