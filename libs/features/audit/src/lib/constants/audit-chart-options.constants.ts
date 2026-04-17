import { ChartOptions } from 'chart.js';

import { trimLabel } from '@customer-portal/shared/helpers/chart';
import { ChartTypeEnum } from '@customer-portal/shared/models/chart';

export const AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Doughnut> =
  {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 8,
        bottom: 32,
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: 400,
            family: '"Nunito Sans", sans-serif',
          },
          pointStyle: 'circle',
          boxHeight: 7,
          color: 'rgb(0, 0, 0)',
        },
        onClick: () => {},
        align: 'start',
      },
    },
    cutout: '75%',
    rotation: 90,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

export const AUDIT_STATUS_BAR_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Bar> = {
  responsive: true,
  maintainAspectRatio: true,
  indexAxis: 'y',
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
      },
      ticks: {
        font: {
          family: 'Nunito Sans',
        },
        minRotation: 0,
        maxRotation: 0,
        // stepSize: 1,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        display: true,
      },
      ticks: {
        autoSkip: false,
        // stepSize: 1,
        callback(_value, index, _ticks) {
          const label = this.getLabelForValue(index);

          return trimLabel(label);
        },
      },
      grace: '50%',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const AUDIT_DAYS_BAR_GRAPH_OPTIONS: ChartOptions<ChartTypeEnum.Bar> = {
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: true,
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
      },
      ticks: {
        // stepSize: 1,
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
      grace: '50%',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
