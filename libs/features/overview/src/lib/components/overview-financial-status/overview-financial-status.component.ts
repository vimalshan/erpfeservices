import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { OverviewFinancialStatusStoreService } from '@customer-portal/data-access/overview';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { ChartComponent } from '@customer-portal/shared/components/chart';
import {
  ChartFilter,
  ChartTypeEnum,
} from '@customer-portal/shared/models/chart';
import { FilterValue } from '@customer-portal/shared/models/grid';

import { OVERVIEW_FINANCIALS_STATUS_OPTIONS } from '../../constants';

const legendBorderState = new WeakMap();

export const customLegendBorderPlugin = {
  id: 'customLegendBorder',
  afterLayout(chart: any) {
    const { legend } = chart;
    if (!legend) return;

    legendBorderState.set(chart, {
      legendTop: legend.top - 1,
    });
  },
  afterDraw(chart: any) {
    const state = legendBorderState.get(chart);
    if (!state?.legendTop) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.strokeStyle = '#D6F0F9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, state.legendTop);
    ctx.lineTo(chartArea.right, state.legendTop);
    ctx.stroke();
    ctx.restore();
  },
};

const customLegendSpacingPlugin = {
  id: 'customLegendSpacing',
  beforeInit(chart: any) {
    const { legend } = chart;
    if (!legend) return;

    const originalFit = legend.fit.bind(legend);

    legend.fit = function customLegendFit() {
      originalFit();
      this.height += -10;
      this.top += 100;
    };
  },
};

const dynamicCenterTextPlugin = {
  id: 'dynamicCenterTextPlugin',
  beforeDatasetDraw(chart: any, _args: any, _pluginOpts: any) {
    const { ctx, data } = chart;

    ctx.save();
    const xCoor = chart.getDatasetMeta(0).data[0].x;
    const yCoor = chart.getDatasetMeta(0).data[0].y;
    ctx.font = '400 10px sans-serif';
    ctx.fillStyle = '#0F204B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Total`, xCoor, yCoor - 10);

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#003591';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      data.datasets[0].data.reduce(
        (accumulator: number, currentValue: number) =>
          accumulator + currentValue,
      ),
      xCoor,
      yCoor + 10,
    );
  },
};

const customLegendFontPlugin = {
  id: 'customLegendFont',
  beforeInit(chart: any) {
    const { legend } = chart.options.plugins;

    if (legend && legend.labels) {
      legend.labels.font = {
        size: 10,
      };
    }
  },
};

@Component({
  selector: 'lib-overview-financial-status',
  imports: [
    CommonModule,
    SharedButtonComponent,
    TranslocoDirective,
    ChartComponent,
  ],
  templateUrl: './overview-financial-status.component.html',
  styleUrl: './overview-financial-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewFinancialStatusComponent implements OnInit {
  overviewFinancialsStatusOptions = OVERVIEW_FINANCIALS_STATUS_OPTIONS;
  financialsStatusChartFilters: ChartFilter = {
    bodyFilter: 'status',
  };
  doughnutCustomPlugins = [
    customLegendBorderPlugin,
    customLegendSpacingPlugin,
    customLegendFontPlugin,
    dynamicCenterTextPlugin,
  ];

  doughnutPlugins = [...this.doughnutCustomPlugins];

  doughnutType = ChartTypeEnum.Doughnut;
  sharedButtonType = SharedButtonType;

  constructor(
    public overviewFinancialStatusStoreService: OverviewFinancialStatusStoreService,
    public overviewSharedStoreService: OverviewSharedStoreService,
  ) {}

  ngOnInit(): void {
    this.overviewFinancialStatusStoreService.loadOverviewFinancialStatusData();
  }

  viewAllInvoices(): void {
    this.overviewSharedStoreService.navigateFromChartToListView([]);
  }

  onTooltipButtonClick(event: FilterValue[]): void {
    this.overviewSharedStoreService.navigateFromChartToListView(event);
  }
}
