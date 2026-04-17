import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { FindingListGraphStoreService } from '@customer-portal/data-access/findings';
import { ChartComponent } from '@customer-portal/shared/components/chart';
import {
  chartTotalPlugin,
  showTooltipOnHoverPlugin,
} from '@customer-portal/shared/helpers/chart';
import {
  ChartFilter,
  ChartTypeEnum,
} from '@customer-portal/shared/models/chart';

import { FINDING_LIST_BY_CATEGORY_GRAPH_OPTIONS } from './finding-list-category-graph-options.constants';
import { FINDING_LIST_BY_STATUS_GRAPH_OPTIONS } from './finding-list-status-options.constants';

@Component({
  selector: 'lib-finding-status-list',
  imports: [CommonModule, TranslocoModule, ChartComponent],
  templateUrl: './finding-list-status.component.html',
  styleUrl: './finding-list-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingListStatusComponent implements OnInit {
  findingsByCategoryGraphOptions = FINDING_LIST_BY_CATEGORY_GRAPH_OPTIONS;
  findingsByStatusGraphOptions = FINDING_LIST_BY_STATUS_GRAPH_OPTIONS;

  readonly doughnutTotalPluginSingle = [
    chartTotalPlugin('doughnutLabel'),
    showTooltipOnHoverPlugin as any,
  ];
  readonly doughnutTotalPluginMulti = [chartTotalPlugin('doughnutLabel')];

  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];

  barType = ChartTypeEnum.Bar;
  doughnutType = ChartTypeEnum.Doughnut;
  findingsByStatusChartFilters: ChartFilter = {
    bodyFilter: 'status',
  };
  findingsByCategoryChartFilters: ChartFilter = {
    titleFilter: 'category',
    bodyFilter: 'status',
  };
  doughnutTotalPluginKey = 0;

  protected destroyRef = inject(DestroyRef);

  constructor(
    public readonly findingListGraphStoreService: FindingListGraphStoreService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadFindingStatusGraphsData();
  }

  onChartClick(_event: any): void {}

  private loadFindingStatusGraphsData(): void {
    if (!this.findingListGraphStoreService.findingsByStatusLoaded()) {
      this.findingListGraphStoreService.loadFindingListByStatusGraphData();
    }

    if (!this.findingListGraphStoreService.findingStatusByCategoryLoaded()) {
      this.findingListGraphStoreService.loadFindingListStatusByCategoryGraphData();
    }
  }
}
