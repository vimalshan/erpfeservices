import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingListGraphStoreService } from '@customer-portal/data-access/findings';
import { NoDataComponent } from '@customer-portal/shared/components/no-data';
import { TreeTableComponent } from '@customer-portal/shared/components/tree-table';
import { FilterValue, TreeNodeClick } from '@customer-portal/shared/models';

@Component({
  selector: 'lib-finding-list-by-clause',
  imports: [
    CommonModule,
    TreeTableComponent,
    TranslocoDirective,
    NoDataComponent,
  ],
  templateUrl: './finding-list-by-clause.component.html',
  styleUrl: './finding-list-by-clause.component.scss',
})
export class FindingListByClauseComponent implements OnInit {
  constructor(
    public readonly findingListGraphStoreService: FindingListGraphStoreService,
  ) {}

  ngOnInit(): void {
    if (!this.findingListGraphStoreService.findingByClauseListLoaded()) {
      this.findingListGraphStoreService.loadFindingListByClauseList();
    }
  }

  onCellClick(data: TreeNodeClick): void {
    const columns =
      this.findingListGraphStoreService.findingsClauseByClauseColumns();

    if (data.rowNode.level !== 0) {
      return;
    }
    const selectionValues: FilterValue[] = [];

    const isExcludedField =
      data.field === columns[0].field ||
      data.field === columns[columns.length - 1].field;

    if (data.rowNode.level === 0) {
      const value = data.rowNode?.node?.data.name;
      const label = 'services';

      selectionValues.push({ label, value: [{ label: value, value }] });

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
}
