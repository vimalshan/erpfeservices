import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  convertToUtcDate,
  mapApiResponseToPageName,
} from '@customer-portal/shared/helpers';

import { iconMap } from '../../constants';
import { ActionsDto, ActionsListDto } from '../../dtos';
import { ActionsModel } from '../../models';

export class ActionsListMapperService {
  static mapToActionsListItemModel(
    dto: ActionsListDto,
    domSanitizer: DomSanitizer,
  ): ActionsModel[] {
    if (!dto?.items) {
      return [];
    }

    const { items } = dto;

    return items.map((actions: ActionsDto) => ({
      id: actions.id,
      actionName: actions.subject,
      dueDate: convertToUtcDate(actions.dueDate),
      message:
        domSanitizer.sanitize(SecurityContext.HTML, actions.message) ?? '',
      language: actions.language,
      service: actions.service,
      site: actions.site,
      entityType: mapApiResponseToPageName(actions.entityType),
      entityId: actions.entityId,
      highPriority: actions.highPriority,
      actions: [
        {
          actionType: 'redirect',
          iconClass: 'pi-angle-right',
          label: 'angle-right',
          url: '',
        },
      ],
      dateWithIcon: {
        displayIcon: actions.highPriority,
        iconClass: 'pi pi-info-circle',
        tooltipMessage: '',
        iconPosition: 'prefix',
      },
      iconTooltip: {
        displayIcon: true,
        iconClass: this.getActionIconClass(actions.entityType?.toLowerCase()),
        tooltipMessage: '',
        iconPosition: 'prefix',
      },
    }));
  }

  private static getActionIconClass(entityType: string): string {
    const matchedKey = this.findMatchingKey(entityType);

    return matchedKey ? iconMap[matchedKey] : iconMap['default'];
  }

  private static findMatchingKey(entityType: string): string | undefined {
    return Object.keys(iconMap).find((key) => entityType.includes(key));
  }
}
