import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { EMPTY_GRAPH_DATA } from '@customer-portal/shared/constants';
import { buildStatusColorPalette } from '@customer-portal/shared/helpers/chart';
import { TreeColumnDefinition } from '@customer-portal/shared/models';
import {
  BarChartModel,
  DoughnutChartModel,
} from '@customer-portal/shared/models/chart';

import {
  CertificateBySiteCountry,
  CertificateBySiteData,
  CertificateBySiteGenericNode,
  CertificateBySiteServices,
  CertificateGraphsFilterCompaniesDataDto,
  CertificateGraphsFilterServicesDataDto,
  CertificateGraphsFilterSitesDataDto,
  CertificatesByStatusGraphDto,
  CertificatesByTypeGraphDto,
} from '../../dtos';

const CERTIFICATES_STATUS_COLOR_MAPPING: Record<string, string> = {
  'Expired Date': '#B5B3B0',
  'In Progress': '#FAF492',
  Issued: '#33A02C',
  'Outstanding invoices': '#D7423B',
  Suspended: '#EB2A34',
  Withdrawn: '#1B338C',
};

export class CertificateGraphsMapperService {
  static mapToCertificateByStatusGraphModel(
    dto: CertificatesByStatusGraphDto,
  ): DoughnutChartModel {
    const statusCounts = dto?.data?.statusCounts;

    if (!statusCounts?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const statuses = Array.from(
      new Set(statusCounts.map(({ status }) => status)),
    );
    const colorPalette = buildStatusColorPalette(
      statuses,
      CERTIFICATES_STATUS_COLOR_MAPPING,
    );

    const datasetData: number[] = [];
    const percentageValues: Record<string, number> = {};

    statusCounts.forEach((s) => {
      datasetData.push(s.count);
      percentageValues[s.status] = s.percent!;
    });

    const model: DoughnutChartModel = {
      data: {
        labels: statuses,
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

  static mapToCertificatesByTypeGraphModel(
    dto: CertificatesByTypeGraphDto,
  ): BarChartModel {
    const stats = dto?.data?.stats;

    if (!stats?.length) {
      return EMPTY_GRAPH_DATA;
    }

    const chartGroups = Array.from(
      new Set(stats.map(({ service }) => service)),
    );

    const chartSeries = Array.from(
      new Set(
        stats.flatMap((stat) => stat.statuses.map(({ status }) => status)),
      ),
    );

    const colorPalette = buildStatusColorPalette(
      chartSeries,
      CERTIFICATES_STATUS_COLOR_MAPPING,
    );

    const groupedData: { [period: string]: { [status: string]: number } } = {};

    stats.forEach(({ service, statuses }) => {
      if (!groupedData[service]) {
        groupedData[service] = {};
      }

      statuses.forEach(({ status, count }) => {
        groupedData[service][status] = count;
      });
    });

    const datasets = chartSeries.map((status, index) => ({
      label: status,
      data: chartGroups.map((service) => groupedData[service]?.[status] || 0),
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

  static mapToCertificateBySiteModel(data: CertificateBySiteData): TreeNode[] {
    const serviceKeys = this.generateServiceKeys(data.services);

    return data.country.map((country) =>
      this.transformSiteEntries(country, serviceKeys),
    );
  }

  static transformSiteEntries(
    country: CertificateBySiteCountry,
    serviceKeys: Record<number, string>,
  ): TreeNode {
    const processNode = (node: CertificateBySiteGenericNode): TreeNode => {
      const result: TreeNode = {
        data: {
          countryName: node.countryName || node.cityName || node.siteName,
        },
      };

      Object.values(serviceKeys).forEach((key) => {
        result.data[key] = false;
      });

      node.services.forEach(({ serviceId }) => {
        if (serviceKeys[serviceId]) {
          result.data[serviceKeys[serviceId]] = true;
        }
      });

      const children = [
        ...(node.cities?.map(processNode) || []),
        ...(node.sites?.map(processNode) || []),
      ];

      if (children.length) {
        result.children = children;
      }

      return result;
    };

    return processNode(country);
  }

  static generateColumnsForSites(
    services: CertificateBySiteServices[],
  ): Record<string, TreeColumnDefinition[]> {
    const firstColumn = {
      field: 'countryName',
      header: 'location',
      isTranslatable: true,
      width: '216px',
    };
    const columns = services.map((service) => ({
      field: `serviceId${service.serviceId}`,
      header: service.serviceName,
      isTranslatable: false,
      width: '129px',
    }));

    return {
      frozenColumns: [firstColumn],
      scrollableColumns: [...columns],
    };
  }

  static mapToChartFilterSites(
    data: CertificateGraphsFilterSitesDataDto[] | undefined,
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

  static mapToCertificateGraphsFilterCompanies(
    data: CertificateGraphsFilterCompaniesDataDto[],
  ): SharedSelectMultipleDatum<number>[] {
    return data.map((datum) => ({
      label: datum.label,
      value: datum.id,
    }));
  }

  static mapToCertificateGraphsFilterServices(
    data: CertificateGraphsFilterServicesDataDto[],
  ): SharedSelectMultipleDatum<number>[] {
    return data.map((datum) => ({
      label: datum.label,
      value: datum.id,
    }));
  }

  static mapToCertificateGraphsFilterSites(
    data: CertificateGraphsFilterSitesDataDto[],
  ): TreeNode[] {
    return this.getCertificateGraphsFilterSites(data);
  }

  private static getCertificateGraphsFilterSites(
    data: CertificateGraphsFilterSitesDataDto[],
  ): TreeNode[] {
    return data.map((datum) => ({
      data: datum.id,
      key: `${datum.id}-${datum.label}`,
      label: datum.label,
      children: datum.children
        ? this.getCertificateGraphsFilterSites(datum.children)
        : undefined,
    }));
  }

  private static generateServiceKeys(
    services: CertificateBySiteServices[],
  ): Record<number, string> {
    return Object.fromEntries(
      services.map((s) => [s.serviceId, `serviceId${s.serviceId}`]),
    );
  }
}
