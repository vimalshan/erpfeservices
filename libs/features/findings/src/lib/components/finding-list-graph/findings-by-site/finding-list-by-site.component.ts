import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingListGraphStoreService } from '@erp-services/data-access/findings';
import { NoDataComponent } from '@erp-services/shared/components/no-data';
import { TreeTableComponent } from '@erp-services/shared/components/tree-table';
import { FilterValue, TreeNodeClick } from '@erp-services/shared/models';

@Component({
  selector: 'lib-finding-list-by-site',
  imports: [
    CommonModule,
    TranslocoDirective,
    TreeTableComponent,
    NoDataComponent,
  ],
  templateUrl: './finding-list-by-site.component.html',
  styleUrl: './finding-list-by-site.component.scss',
})
export class FindingListBySiteComponent {
  constructor(
    public readonly findingListGraphStoreService: FindingListGraphStoreService,
  ) {
    if (!this.findingListGraphStoreService.findingsBySiteListLoaded()) {
      this.findingListGraphStoreService.loadFindingListBySiteList();
    }
  }

  onCellClick(data: TreeNodeClick): void {
    const columns =
      this.findingListGraphStoreService.findingsBySiteListColumns();

    if (data.rowNode.level !== 0) {
      return;
    }

    const isExcludedField =
      data.field === columns[0].field ||
      data.field === columns[columns.length - 1].field;

    const selectionValues: FilterValue[] = [
      {
        label: columns[0].header,
        value: [
          {
            label: data.rowNode.node?.data.name,
            value: data.rowNode.node?.data.name,
          },
        ],
      },
    ];

    if (!isExcludedField) {
      const clickedColumn = columns.find((col) => col.field === data.field);

      if (clickedColumn) {
        selectionValues.push({
          label: 'category',
          value: [
            {
              label: clickedColumn.header,
              value: clickedColumn.field,
            },
          ],
        });
      }
    }

    this.findingListGraphStoreService.navigateFromFindingListTreeTableToListView(
      selectionValues,
    );
  }
}
