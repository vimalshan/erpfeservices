import { ChartOptions } from 'chart.js';

import { ChartTypeEnum } from '@customer-portal/shared';

export const FINDING_BY_CATEGORY_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Bar> =
  {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
        },
        ticks: {
          font: {
            family: 'Nunito Sans',
          },
          minRotation: 0,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
        },
        ticks: {
          stepSize: 1,
        },
        grace: '5%',
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
