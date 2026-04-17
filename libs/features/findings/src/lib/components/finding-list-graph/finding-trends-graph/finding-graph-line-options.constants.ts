import { ChartOptions } from 'chart.js';

import { ChartTypeEnum } from '@customer-portal/shared';

export const FINDINGS_GRAPH_LINE_OPTIONS: ChartOptions<ChartTypeEnum.Line> = {
  responsive: true,
  aspectRatio: 3,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 100,
      },
      beginAtZero: true,
    },
  },
};
