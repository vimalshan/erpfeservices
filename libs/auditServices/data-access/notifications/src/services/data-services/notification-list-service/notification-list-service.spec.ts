import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { UpdateNotificationReadStatusResponse } from '../../../dtos';
import { NotificationListModel } from '../../../models';
import { NotificationListService } from './notification-list-service';

describe('NotificationListService', () => {
  let service: NotificationListService;
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
    mutate: jest.fn(),
  };

  const notificationList: NotificationListModel = {
    notifications: [
      {
        id: 1,
        actionName: 'action',
        isRead: true,
        iconTooltip: {
          iconClass: 'read-notification',
          displayIcon: false,
          iconPosition: '',
          tooltipMessage: '',
        },
        title: '',
        message: '',
        receivedOn: '',
        actions: [
          {
            actionType: '',
            iconClass: '',
            label: '',
            url: '',
          },
        ],
        entityType: '',
        entityId: '2567',
      },
    ],
  };

  const updateNotificationReadStatusSuccessResponse: UpdateNotificationReadStatusResponse =
    {
      data: {
        updateNotificationReadStatus: {
          data: { statusMessage: '', isSuccess: true },
          isSuccess: true,
          message: '',
          errorCode: '',
        },
      },
    };

  const updateNotificationReadStatusFailureResponse: UpdateNotificationReadStatusResponse =
    {
      data: {
        updateNotificationReadStatus: {
          data: { statusMessage: '', isSuccess: false },
          isSuccess: false,
          message: '',
          errorCode: '',
        },
      },
    };

  apolloMock.query = jest
    .fn()
    .mockReturnValue(of(notificationList.notifications));

  beforeEach(() => {
    service = new NotificationListService(apolloMock as Apollo);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should update the provided notification id isRead status as true', () => {
    // Arrange
    let isRead = false;
    const idToUpdate = 1;
    apolloMock.mutate = jest
      .fn()
      .mockReturnValue(of(updateNotificationReadStatusSuccessResponse));

    // Act
    const result$ = service.updateNotification(idToUpdate);
    result$.subscribe((data) => {
      isRead = data;
    });

    // Assert
    expect(isRead).toEqual(true);
  });

  test('should not update any other notification', () => {
    // Arrange
    let isRead = false;
    const idToUpdate = -1;
    apolloMock.mutate = jest
      .fn()
      .mockReturnValue(of(updateNotificationReadStatusFailureResponse));

    // Act
    const result$ = service.updateNotification(idToUpdate);
    result$.subscribe((data) => {
      isRead = data;
    });

    // Assert
    expect(isRead).toBe(false);
  });

  test('should return notifications data', (done) => {
    // Arrange
    const expectedNotificationsList = {
      currentPage: 1,
      items: [
        {
          createdTime: '03.10.2024',
          infoId: 11,
          message:
            'Your auditor has shared the audit plan for ISO 9001:2017 and ISO 14001:2018.',
          notificationCategory: '',
          readStatus: true,
          subject: 'Audit plan available',
          entityType: 'Audit',
          entityId: '2355',
        },
      ],
      totalItems: 26,
      totalPages: 2,
    };

    jest
      .spyOn(service, 'getNotificationList')
      .mockReturnValue(of(expectedNotificationsList));

    // Act
    service.getNotificationList().subscribe((notification) => {
      const notificationsListCount = notification.items.length;

      // Assert
      expect(notificationsListCount).toEqual(1);
      done();
    });
  });
});
