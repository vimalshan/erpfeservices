import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';

import { OverviewFilterDataDto } from '../../dtos';

export class OverviewFilterMapperService {
  static mapToOverviewFilterList(
    data: OverviewFilterDataDto[],
  ): SharedSelectMultipleDatum<number>[] {
    return data.map((datum) => ({
      label: datum.label,
      value: datum.id,
    }));
  }

  static mapToOverviewFilterTree(data: OverviewFilterDataDto[]): TreeNode[] {
    return this.getOverviewFilterTree(data);
  }

  private static getOverviewFilterTree(
    data: OverviewFilterDataDto[],
    depth = 0,
  ): TreeNode[] {
    return data.map((datum) => ({
      data: datum.id,
      depth,
      key: `${datum.id}-${datum.label}`,
      label: datum.label,
      children: datum?.children?.length
        ? this.getOverviewFilterTree(datum.children, depth + 1)
        : undefined,
    }));
  }
}
