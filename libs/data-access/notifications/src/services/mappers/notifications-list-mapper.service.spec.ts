import { ApiResponseToPageNameMapping } from '@customer-portal/shared';

import { NotificationListDto } from '../../dtos';
import { NotificationsListMapperService } from './notifications-list-mapper.service';

describe('NotificationsListMapperService', () => {
  const mockDomSanitizer = {
    sanitize: (_: number, html: string) => html,
  } as any;

  describe('mapToNotificationsListModel', () => {
    test('should return an empty array if input is null or undefined', () => {
      // Arrange
      const mockedDto = null;

      // Act
      const result = NotificationsListMapperService.mapToNotificationsListModel(
        mockedDto as unknown as NotificationListDto,
        mockDomSanitizer,
      );

      // Assert
      expect(result).toEqual([]);
    });

    test('should map notification DTOs to NotificationModels correctly', () => {
      // Arrange
      const mockedDto: NotificationListDto = {
        items: [
          {
            createdTime: '2025-04-17T15:05:01.500+00:00',
            infoId: 99,
            message:
              'A newFindings management event New Finding has occured, Please Validate.',
            notificationCategory: 'New NC',
            readStatus: false,
            subject: 'Updation: New Finding',
            entityType: 'Findings management',
            entityId: 'MARTOC-0005-2757008',
          },
        ],
        currentPage: 1,
        totalItems: 30,
        totalPages: 3,
      };
      const expectedResult = [
        {
          id: 99,
          isRead: false,
          actionName: 'navigateFromNotification',
          title: 'Updation: New Finding',
          message:
            'A newFindings management event New Finding has occured, Please Validate.',
          receivedOn: '17-04-2025',
          entityType: ApiResponseToPageNameMapping.Findings,
          entityId: 'MARTOC-0005-2757008',
          actions: [
            {
              actionType: 'redirect',
              iconClass: 'pi-angle-right',
              label: 'angle-right',
              url: '',
            },
          ],
          iconTooltip: {
            displayIcon: true,
            iconClass: 'pi pi-circle-fill',
            iconPosition: 'prefix',
            tooltipMessage: 'Audit plan available',
          },
        },
      ];

      // Act
      const result = NotificationsListMapperService.mapToNotificationsListModel(
        mockedDto,
        mockDomSanitizer,
      );

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
