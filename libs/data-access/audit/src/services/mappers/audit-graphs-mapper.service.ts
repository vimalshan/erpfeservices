import { TreeNode } from 'primeng/api';

import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import {
  buildStatusColorPalette,
  getPaletteColorOrFallback,
} from '@customer-portal/shared/helpers/chart';
import {
  BarChartModel,
  DoughnutChartModel,
} from '@customer-portal/shared/models/chart';

import {
  AuditGraphsFilterSitesDataDto,
  AuditsDaysGraphDto,
  AuditsStatusDoughnutGraphDto,
  AuditStatusBarGraphDto,
} from '../../dtos';
import { AuditDaysBarGraphDto } from '../../dtos/audit-days-bar-graph.dto';

const AUDIT_STATUS_COLOR_MAPPING: Record<string, string> = {
  Confirmed: '#AEE9FF',
  'In Progress': '#FAF492',
  'To be confirmed': '#FBB482',
  Completed: '#79BA72',
  'Findings Open': '#EB2A34',
  Cancelled: '#CCCBC9',
};

export class AuditGraphsMapperService {
  static mapToAuditStatusDoughnutGraphModel(
    dto: AuditsStatusDoughnutGraphDto,
  ): DoughnutChartModel {
    const stats = dto?.data?.stats;

    if (!stats?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const statuses = Array.from(new Set(stats.map(({ status }) => status)));
    const colorPalette = buildStatusColorPalette(
      statuses,
      AUDIT_STATUS_COLOR_MAPPING,
    );

    const labels: string[] = [];
    const datasetData: number[] = [];
    const percentageValues: Record<string, number> = {};

    stats.forEach(({ status, count, percent }) => {
      labels.push(status);
      datasetData.push(count);
      percentageValues[status] = percent!;
    });

    const model: DoughnutChartModel = {
      data: {
        labels,
        datasets: [
          {
            data: datasetData,
            backgroundColor: colorPalette,
            hoverBackgroundColor: colorPalette,
          },
        ],
        percentageValues,
      },
    };

    return model;
  }

  static mapToAuditStatusBarTypeGraphModel(
    dto: AuditStatusBarGraphDto,
  ): BarChartModel {
    const stats = dto?.data?.stats;

    if (!stats?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const chartGroups = Array.from(new Set(stats.map(({ type }) => type)));

    const chartSeries = Array.from(
      new Set(
        stats.flatMap((stat) => stat.statuses.map(({ status }) => status)),
      ),
    );

    const colorPalette = buildStatusColorPalette(
      chartSeries,
      AUDIT_STATUS_COLOR_MAPPING,
    );

    const groupedData: { [period: string]: { [status: string]: number } } = {};

    stats.forEach(({ type, statuses }) => {
      if (!groupedData[type]) {
        groupedData[type] = {};
      }

      statuses.forEach(({ status, count }) => {
        groupedData[type][status] = count;
      });
    });

    const datasets = chartSeries.map((status, index) => ({
      label: status,
      data: chartGroups.map((period) => groupedData[period]?.[status] || 0),
      backgroundColor: colorPalette[index],
    }));

    const model: BarChartModel = {
      data: {
        labels: chartGroups,
        datasets,
      },
    };

    return model;
  }

  static mapToAuditDaysDoughnutGraphModel(
    dto: AuditsDaysGraphDto,
  ): DoughnutChartModel {
    const pieChartData = dto?.data?.pieChartData;

    if (!pieChartData?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const labels: string[] = [];
    const datasetData: number[] = [];
    const backgroundColors: string[] = [];
    const percentageValues: Record<string, number> = {};

    pieChartData.forEach((d, i) => {
      labels.push(d.serviceName);
      datasetData.push(d.auditDays);
      backgroundColors.push(getPaletteColorOrFallback(i));
      percentageValues[d.serviceName] = d.auditpercentage!;
    });

    const model: DoughnutChartModel = {
      data: {
        labels,
        datasets: [
          {
            data: datasetData,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors,
          },
        ],
        percentageValues,
      },
    };

    return model;
  }

  static mapToAuditDaysBarTypeGraphModel(
    dto: AuditDaysBarGraphDto,
  ): BarChartModel {
    const chartData = dto?.data?.chartData;

    if (!chartData?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const serviceNames = Array.from(
      new Set(
        chartData.flatMap(({ serviceData }) =>
          serviceData.map((s) => s.serviceName),
        ),
      ),
    );

    const labels = chartData.map(({ month }) => month);

    const datasets = serviceNames.map((serviceName: string, index: number) => ({
      label: serviceName,
      data: chartData.map(({ serviceData }) => {
        const serviceEntry = serviceData.find(
          (s) => s.serviceName === serviceName,
        );

        return serviceEntry ? serviceEntry.auditDays : 0;
      }),
      backgroundColor: getPaletteColorOrFallback(index),
      borderColor: 'white',
      borderWidth: 2,
    }));

    return {
      data: {
        labels,
        datasets,
      },
    };
  }

  static mapToChartFilterSites(
    data: AuditGraphsFilterSitesDataDto[] | undefined,
    depth = 0,
  ): TreeNode[] {
    return (data || []).map((datum) => ({
      data: datum.id,
      depth,
      key: `${datum.id}-${datum.label}`,
      label: datum.label,
      children: this.mapToChartFilterSites(datum.children, depth + 1),
    }));
  }
}
