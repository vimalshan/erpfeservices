import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';

import { ActionFilterDto, ActionSiteDto } from '../../dtos';

export class ActionFilterMapperService {
  static mapToActionFilter(
    data: ActionFilterDto[],
  ): SharedSelectMultipleDatum<number>[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((datum) => ({
      label: datum.label,
      value: datum.id,
    }));
  }

  static mapToActionSitesFilter(data: ActionSiteDto[]): TreeNode[] {
    return this.mapTreeNodeToSite(data);
  }

  private static mapTreeNodeToSite(data: ActionSiteDto[] = []): TreeNode[] {
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
