import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  FindingListGraphStoreService,
  getOpenFindingsDateRange,
  OpenFindingsMonthsPeriod,
} from '@customer-portal/data-access/findings';
import { ChartComponent } from '@customer-portal/shared/components/chart';
import { createOrUpdateLegendForCharts } from '@customer-portal/shared/helpers/chart';
import { formatFilter } from '@customer-portal/shared/helpers/grid';
import {
  ChartFilter,
  ChartTypeEnum,
} from '@customer-portal/shared/models/chart';
import { FilterValue } from '@customer-portal/shared/models/grid';

import { OPEN_FINDINGS_LIST_GRAPH_OPTIONS } from './open-findings-list-graphs-options.constants';

@Component({
  selector: 'lib-open-findings-list',
  imports: [CommonModule, TranslocoDirective, ChartComponent],
  templateUrl: './open-findings-list.component.html',
  styleUrl: './open-findings-list.component.scss',
})
export class OpenFindingsListComponent implements OnInit {
  private legendTimeout: any;
  barType = ChartTypeEnum.Bar;
  openFindingsMonthsPeriod = OpenFindingsMonthsPeriod;
  openFindingsGraphOptions = OPEN_FINDINGS_LIST_GRAPH_OPTIONS;
  sharedLegendId = 'shared-legend';
  openFindingsChartFilters: ChartFilter = {
    titleFilter: 'services',
    bodyFilter: 'category',
  };

  openFindingsData = computed(() => ({
    overdueGraphData:
      this.findingListGraphStoreService.overdueFindingsGraphData().data,
    becomingOverdueGraphData:
      this.findingListGraphStoreService.becomingOverdueFindingsGraphData().data,
    inProgressGraphData:
      this.findingListGraphStoreService.inProgressFindingsGraphData().data,
    earlyStageGraphData:
      this.findingListGraphStoreService.earlyStageFindingsGraphData().data,
  }));

  @ViewChildren(ChartComponent) chartComponents!: QueryList<ChartComponent>;

  constructor(
    public readonly findingListGraphStoreService: FindingListGraphStoreService,
  ) {
    effect(() => {
      this.openFindingsData();
      clearTimeout(this.legendTimeout);
      this.legendTimeout = setTimeout(() => {
        this.refreshLegend();
      });
    });
  }

  ngOnInit(): void {
    this.loadOpenFindingsIfNotPresent();
  }

  onLegendClick(_event: any): void {
    createOrUpdateLegendForCharts(
      this.sharedLegendId,
      this.chartComponents.toArray(),
    );
  }

  onChartClick(_event: any): void {}

  onTooltipClick(
    filters: FilterValue[],
    period: OpenFindingsMonthsPeriod,
  ): void {
    const dateFilter: FilterValue[] =
      this.extractFilterValuesBasedOnPeriod(period);

    this.findingListGraphStoreService.navigateFromFindingListChartToListView([
      ...filters,
      ...dateFilter,
    ]);
  }

  private refreshLegend(): void {
    if (this.chartComponents?.length) {
      createOrUpdateLegendForCharts(
        this.sharedLegendId,
        this.chartComponents.toArray(),
      );
    }
  }

  private extractFilterValuesBasedOnPeriod(
    period: OpenFindingsMonthsPeriod,
  ): FilterValue[] {
    const { startDate, endDate } = getOpenFindingsDateRange(period);

    return formatFilter([startDate, endDate], 'openDate');
  }

  private loadOpenFindingsIfNotPresent(): void {
    const {
      overdueFindingsLoaded,
      becomingOverdueFindingsLoaded,
      inProgressFindingsLoaded,
      earlyStageFindingsLoaded,
    } = this.findingListGraphStoreService;

    if (
      !overdueFindingsLoaded() ||
      !becomingOverdueFindingsLoaded() ||
      !inProgressFindingsLoaded() ||
      !earlyStageFindingsLoaded()
    ) {
      this.findingListGraphStoreService.loadOpenFindingListGraphData();
    }
  }
}
