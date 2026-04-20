import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@erp-services/shared/components/select/multiple';

import { NotificationFilterDto, NotificationSiteDto } from '../../dtos';

export class NotificationFilterMapperService {
  static mapToNotificationFilter(
    data: NotificationFilterDto[],
  ): SharedSelectMultipleDatum<number>[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((datum) => ({
      label: datum.name,
      value: datum.id,
    }));
  }

  static mapToNotificationSitesFilter(data: NotificationSiteDto[]): TreeNode[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((datum) => ({
      data: datum.id,
      key: `${datum.id}-${datum.name}`,
      label: datum.name,
    }));
  }
}
