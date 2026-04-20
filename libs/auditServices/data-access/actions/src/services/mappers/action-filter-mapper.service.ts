import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@erp-services/shared/components/select/multiple';

import { ActionFilterDto, ActionSiteDto } from '../../dtos';

export class ActionFilterMapperService {
  static mapToActionFilter(
    data: ActionFilterDto[],
  ): SharedSelectMultipleDatum<number>[] {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((datum) => ({
      label: datum.name,
      value: datum.id,
    }));
  }

  static mapToActionSitesFilter(data: ActionSiteDto[]): TreeNode[] {
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
