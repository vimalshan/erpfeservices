import { ChartOptions } from 'chart.js';

import { ChartTypeEnum } from '@customer-portal/shared';

export const OVERVIEW_FINANCIALS_STATUS_OPTIONS: ChartOptions<ChartTypeEnum.Doughnut> =
  {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 5,
        bottom: 15,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
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
      tooltip: {
        position: 'average',
      },
    },
    cutout: '70%',
    radius: '85%',
    rotation: 270,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };
