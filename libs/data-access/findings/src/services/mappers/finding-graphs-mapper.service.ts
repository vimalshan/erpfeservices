import { TreeNode } from 'primeng/api';

import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import { buildStatusColorPalette } from '@customer-portal/shared/helpers/chart';
import {
  BarChartModel,
  DoughnutChartModel,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';

import {
  FindingGraphsFilterSitesDataDto,
  FindingsByStatusGraphDto,
  FindingStatusByCategoryGraphDto,
  FindingsTrendsGraphDto,
  OpenFindingsGraphDto,
} from '../../dtos';
import {
  generateColumnsForTrends,
  generateGradientMapping,
} from '../../helpers';
import { FindingTrendsGraphModel } from '../../models';

const OPEN_FINDINGS_CATEGORY_COLOR_MAPPING: Record<string, string> = {
  Observation: '#AEE9FF',
  'CAT2 (Minor)': '#FFF699',
  'CAT1 (Major)': '#F7AAAE',
  'Opportunity for Improvement': '#FBB482',
};

const FINDINGS_BY_STATUS_COLOR_MAPPING: Record<string, string> = {
  Open: '#FAF492',
  Accepted: '#33A02C',
  Closed: '#CCCBC9',
  'Not applicable': '#E6E6E5',
};

const FINDINGS_STATUS_BY_CATEGORY_MAPPING: Record<string, string> = {
  Open: '#FAF492',
  Accepted: '#3F9C35',
  Closed: '#CCCBC9',
  'Not applicable': '#E6E6E5',
};

const FINDINGS_CATEGORY_TRENDS_COLOR_MAPPING: Record<string, string> = {
  Observation: '#AEE9FF',
  'CAT2 (Minor)': '#FFF699',
  'CAT1 (Major)': '#D3262F',
  'Opportunity for Improvement': '#FBB482',
  'Noteworthy Effort': '#3F9C35',
};

export class FindingGraphsMapperService {
  static mapToOpenFindingsGraphModel(dto: OpenFindingsGraphDto): BarChartModel {
    const services = dto?.data?.services;

    if (!services?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const chartGroups = Array.from(
      new Set(services.map(({ service }) => service)),
    );

    const chartSeries = Array.from(
      new Set(
        services.flatMap((service) =>
          service.categories.map(({ category }) => category),
        ),
      ),
    );

    const colorPalette = buildStatusColorPalette(
      chartSeries,
      OPEN_FINDINGS_CATEGORY_COLOR_MAPPING,
    );

    const groupedData: {
      [service: string]: { [category: string]: number };
    } = {};

    services.forEach(({ service, categories }) => {
      if (!groupedData[service]) {
        groupedData[service] = {};
      }

      categories.forEach(({ category, count }) => {
        groupedData[service][category] = count;
      });
    });

    const datasets = chartSeries.map((category, index) => ({
      label: category,
      data: chartGroups.map((service) => groupedData[service]?.[category] || 0),
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

  static mapToFindingsByStatusGraphModel(
    dto: FindingsByStatusGraphDto,
  ): DoughnutChartModel {
    const stats = dto?.data?.stats;

    if (!stats?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const statuses = Array.from(new Set(stats.map((s) => s.status)));
    const colorPalette = buildStatusColorPalette(
      statuses,
      FINDINGS_BY_STATUS_COLOR_MAPPING,
    );

    const labels: string[] = [];
    const dataset: number[] = [];
    const percentageValues: Record<string, number> = {};

    stats.forEach(({ status, count, percent }) => {
      labels.push(status);
      dataset.push(count);
      percentageValues[status] = percent!;
    });

    const model: DoughnutChartModel = {
      data: {
        labels,
        datasets: [
          {
            data: dataset,
            backgroundColor: colorPalette,
            hoverBackgroundColor: colorPalette,
          },
        ],
        percentageValues,
      },
    };

    return model;
  }

  static mapToFindingStatusByCategoryGraphModel(
    dto: FindingStatusByCategoryGraphDto,
  ): BarChartModel {
    const stats = dto?.data?.stats;

    if (!stats?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const chartGroups = Array.from(
      new Set(stats.map(({ category }) => category)),
    );

    const chartSeries = Array.from(
      new Set(
        stats.flatMap(({ statuses }) => statuses.map(({ status }) => status)),
      ),
    );

    const colorPalette = buildStatusColorPalette(
      chartSeries,
      FINDINGS_STATUS_BY_CATEGORY_MAPPING,
    );

    const groupedData: { [period: string]: { [status: string]: number } } = {};

    stats.forEach(({ category, statuses }) => {
      if (!groupedData[category]) {
        groupedData[category] = {};
      }

      statuses.forEach(({ status, count }) => {
        groupedData[category][status] = count;
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

  static mapToChartFilterSites(
    data: FindingGraphsFilterSitesDataDto[] | undefined,
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

  static mapToFindingsTrendsGraphModel(
    dto: FindingsTrendsGraphDto,
  ): FindingTrendsGraphModel {
    const categories = dto?.data?.categories ?? [];

    const chartSeries = Array.from(
      new Set(categories.map((category) => category.categoryName)),
    );

    const colorPalette = buildStatusColorPalette(
      chartSeries,
      FINDINGS_CATEGORY_TRENDS_COLOR_MAPPING,
    );

    const allYears = new Set<number>(
      categories.flatMap((category) => category.findings.map((f) => f.year)),
    );

    const sortedYears = Array.from(allYears).sort((a, b) => a - b);

    const datasets = categories.map((category, index) => {
      const color = colorPalette[index];

      return {
        label: category.categoryName,
        data: sortedYears.map(
          (year) => category.findings.find((f) => f.year === year)?.count ?? 0,
        ),
        backgroundColor: color,
        borderColor: color,
      };
    });

    return {
      data: {
        labels: sortedYears.map(String),
        datasets,
      },
    };
  }

  static generateColumnsForTrends(nodes: TreeNode[]): TreeColumnDefinition[] {
    return generateColumnsForTrends(nodes);
  }

  static generateGradientMapping(
    data: TreeNode[] | undefined,
    targetProperty?: string,
  ): Map<number, string> {
    return generateGradientMapping(
      Array.isArray(data) ? data : [],
      targetProperty,
    );
  }
}
