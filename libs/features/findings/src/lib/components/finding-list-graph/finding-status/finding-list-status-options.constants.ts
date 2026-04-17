import { ChartOptions } from 'chart.js';

import { ChartTypeEnum } from '@customer-portal/shared';

export const FINDING_LIST_BY_STATUS_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Doughnut> =
  {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        bottom: 32,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
            weight: 400,
            family: '"Nunito Sans", sans-serif',
          },
          pointStyle: 'circle',
          boxHeight: 7,
          color: '#000',
        },
        onClick: () => {},
        align: 'start',
      },
    },
    cutout: '75%',
    rotation: 270,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };
