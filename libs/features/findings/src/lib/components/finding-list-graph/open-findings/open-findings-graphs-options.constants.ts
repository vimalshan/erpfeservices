import { ChartOptions } from 'chart.js';

import { ChartTypeEnum } from '@customer-portal/shared';

export const OPEN_FINDINGS_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Bar> = {
  responsive: true,
  maintainAspectRatio: true,
  indexAxis: 'y',
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
      },
      grace: '20%',
      ticks: {
        stepSize: 1,
        font: {
          family: 'Nunito Sans',
        },
        minRotation: 0,
        maxRotation: 0,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        display: true,
      },
      grace: '20%',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
