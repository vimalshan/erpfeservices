import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { convertToUtcDate } from '@erp-services/shared/helpers/date';

import { NotificationListDto, NotificationsDto } from '../../dtos';
import { NotificationModel } from '../../models';

export class NotificationsListMapperService {
  static mapToNotificationsListModel(
    dto: NotificationListDto,
    domSanitizer: DomSanitizer,
  ): NotificationModel[] {
    if (!dto?.data) {
      return [];
    }

    return dto.data.map((notification: NotificationsDto) => ({
      id: notification.id,
      isRead: notification.isRead,
      actionName: 'navigateFromNotification',
      title: notification.title,
      message:
        domSanitizer.sanitize(SecurityContext.HTML, notification.message) ?? '',
      language: '',
      receivedOn: convertToUtcDate(notification.createdDate),
      entityType: '',
      entityId: '',
      snowLink: '',
      actions: [
        {
          actionType: 'redirect',
          iconClass: 'pi-angle-right',
          label: 'angle-right',
          url: '',
        },
      ],
      iconTooltip: {
        displayIcon: notification.isRead === false,
        iconClass: '',
        iconPosition: '',
        tooltipMessage: 'Audit plan available',
      },
    }));
  }
}
