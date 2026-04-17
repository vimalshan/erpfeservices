import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingListGraphStoreService } from '@customer-portal/data-access/findings';
import { ChartComponent } from '@customer-portal/shared/components/chart';
import { TreeTableComponent } from '@customer-portal/shared/components/tree-table';
import {
  ChartFilter,
  ChartTypeEnum,
  TrendsChartInterval,
} from '@customer-portal/shared/models';

import { FINDINGS_GRAPH_LINE_OPTIONS } from './finding-graph-line-options.constants';

@Component({
  selector: 'lib-finding-list-trends-graph',
  imports: [
    CommonModule,
    TranslocoDirective,
    ChartComponent,
    TreeTableComponent,
  ],
  templateUrl: './finding-list-trends-graph.component.html',
  styleUrl: './finding-list-trends-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingListTrendsGraphComponent implements OnInit {
  lineType = ChartTypeEnum.Line;
  findingsGraphLineOptions = FINDINGS_GRAPH_LINE_OPTIONS;
  findingTrendsChartFilters: ChartFilter = {
    titleFilter: {
      interval: TrendsChartInterval.Year,
      field: 'openDate',
    },
    bodyFilter: 'category',
  };

  constructor(
    public findingListGraphStoreService: FindingListGraphStoreService,
  ) {}

  ngOnInit(): void {
    if (!this.findingListGraphStoreService.findingTrendsDataLoaded()) {
      this.findingListGraphStoreService.loadFindingListDataTrends();
    }

    if (!this.findingListGraphStoreService.findingTrendsGraphDataLoaded()) {
      this.findingListGraphStoreService.loadFindingListTrendsGraphData();
    }
  }
}
