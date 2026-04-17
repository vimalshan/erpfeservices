import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';

import { NotificationFilterDto, NotificationSiteDto } from '../../dtos';

export class NotificationFilterMapperService {
  static mapToNotificationFilter(
    data: NotificationFilterDto[],
  ): SharedSelectMultipleDatum<number>[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((datum) => ({
      label: datum.label,
      value: datum.id,
    }));
  }

  static mapToNotificationSitesFilter(data: NotificationSiteDto[]): TreeNode[] {
    return this.mapTreeNodeToSite(data);
  }

  private static mapTreeNodeToSite(data: NotificationSiteDto[]): TreeNode[] {
    return data.map((datum) => ({
      data: datum.id,
      key: `${datum.id}-${datum.label}`,
      label: datum.label,
      children: datum?.children?.length
        ? this.mapTreeNodeToSite(datum.children)
        : undefined,
    }));
  }
}
