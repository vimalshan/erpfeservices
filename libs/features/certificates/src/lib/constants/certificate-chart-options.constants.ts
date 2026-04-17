import { ChartOptions } from 'chart.js';

import { trimLabel } from '@customer-portal/shared/helpers/chart';
import { ChartTypeEnum } from '@customer-portal/shared/models/chart';

export const CERTIFICATES_BY_STATUS_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Doughnut> =
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
        align: 'start',
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
      },
    },
    cutout: '75%',
    rotation: 270,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

export const CERTIFICATES_BY_TYPE_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Bar> =
  {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        ticks: {
          stepSize: 1,
          font: {
            family: 'Nunito Sans',
          },
          minRotation: 0,
          maxRotation: 0,
        },
        title: {
          display: true,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
        },
        grace: '5%',
        ticks: {
          autoSkip: false,
          callback(_value, index, _ticks) {
            const label = this.getLabelForValue(index);

            return trimLabel(label);
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
