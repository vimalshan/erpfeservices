import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { mapApiResponseToPageName } from '@customer-portal/shared/helpers';
import { convertToUtcDate } from '@customer-portal/shared/helpers/date';

import { NotificationListDto, NotificationsDto } from '../../dtos';
import { NotificationModel } from '../../models';

export class NotificationsListMapperService {
  static mapToNotificationsListModel(
    dto: NotificationListDto,
    domSanitizer: DomSanitizer,
  ): NotificationModel[] {
    if (!dto) {
      return [];
    }

    const { items } = dto.data;

    return items.map((notification: NotificationsDto) => ({
      id: notification.infoId,
      isRead: notification.readStatus,
      actionName: 'navigateFromNotification',
      title: notification.subject,
      message:
        domSanitizer.sanitize(SecurityContext.HTML, notification.message) ?? '',
      language: notification.language,
      receivedOn: convertToUtcDate(notification.createdTime),
      entityType: mapApiResponseToPageName(notification.entityType),
      entityId: notification.entityId,
      snowLink: notification.snowLink,
      actions: [
        {
          actionType: 'redirect',
          iconClass: 'pi-angle-right',
          label: 'angle-right',
          url: '',
        },
      ],
      iconTooltip: {
        displayIcon: notification.readStatus === false,
        iconClass: '',
        iconPosition: '',
        tooltipMessage: 'Audit plan available',
      },
    }));
  }
}
