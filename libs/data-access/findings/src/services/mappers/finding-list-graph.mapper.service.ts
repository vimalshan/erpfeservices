import { TreeNode } from 'primeng/api';

import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import {
  CustomTreeNode,
  ServiceDetailsMaster,
  SiteDetailsMaster,
} from '@customer-portal/shared';

import {
  FindingGraphsFilterSitesDataDto,
  FindingListItemDto,
  FindingListItemEnrichedDto,
  FindingsByStatusGraphDto,
  FindingsSiteResponse,
  FindingStatusByCategoryGraphDto,
  FindingStatusByCategoryStatistics,
  OpenFindingsGraphData,
  OpenFindingsGraphDto,
  OpenFindingsStatistics,
  OpenFindingsStatisticsDto,
} from '../../dtos';
import { FindingStatusStatisticsDto } from '../../dtos/finding-status-statistics.dto';
import { getOpenFindingsDateRange } from '../../helpers';
import { FindingStatus, OpenFindingsMonthsPeriod } from '../../models';

export class FindingListGraphMapperService {
  static recalculateState(
    findings: FindingListItemEnrichedDto[],
    filterCompanies: number[],
    filterServices: number[],
    filterSites: number[],
    filterStartDate: Date | null,
    filterEndDate: Date | null,
  ) {
    const filterCompaniesSet = new Set(filterCompanies);
    const filterServicesSet = new Set(filterServices);
    const filterSitesSet = new Set(filterSites);

    const filtered = findings.filter((item) => {
      const matchesCompany =
        !filterCompaniesSet.size || filterCompaniesSet.has(item.companyId);
      const matchesService =
        !filterServicesSet.size ||
        (item.serviceDetails ?? []).some((s) => filterServicesSet.has(s.id));
      const matchesSite =
        !filterSitesSet.size ||
        (item.siteDetails ?? []).some((s) => filterSitesSet.has(s.id));
      const openDate = new Date(item.openDate ?? '');
      const filterStartDateNorm = filterStartDate
        ? new Date(filterStartDate)
        : null;
      const filterEndDateNorm = filterEndDate ? new Date(filterEndDate) : null;

      openDate.setHours(0, 0, 0, 0);
      if (filterStartDateNorm) filterStartDateNorm.setHours(0, 0, 0, 0);
      if (filterEndDateNorm) filterEndDateNorm.setHours(0, 0, 0, 0);

      const matchesDate =
        (!filterStartDateNorm || openDate >= filterStartDateNorm) &&
        (!filterEndDateNorm || openDate <= filterEndDateNorm);

      return matchesCompany && matchesService && matchesSite && matchesDate;
    });

    const dataCompanies = this.buildDataCompanies(filtered);
    const dataServices = this.buildDataServices(filtered);
    const sitesDto = this.buildFindingGraphsFilterSitesData(filtered);
    const sortedSitesDto = [...sitesDto].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    const dataSites = this.mapToChartFilterSites(sortedSitesDto);

    return { findingItems: filtered, dataCompanies, dataServices, dataSites };
  }

  static getStatusesForOpenFindingsGraph(): FindingStatus[] {
    return [
      FindingStatus.Open,
      FindingStatus.Reverted,
      FindingStatus.Responded,
      FindingStatus.Accepted,
    ];
  }

  static parseTooltipDate(dateStr: string): Date {
    // If already in yyyy-mm-dd, just use new Date(dateStr)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr);
    }

    // If in dd-mm-yyyy, convert to yyyy-mm-dd
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-');

      return new Date(`${year}-${month}-${day}`);
    }

    return new Date(dateStr);
  }

  static generateOpenFindingsGraphDtoForOverdueByDate(
    findings: FindingListItemEnrichedDto[],
    period: OpenFindingsMonthsPeriod,
    filteredServices: number[] = [],
  ): OpenFindingsGraphDto {
    const { startDate, endDate } = getOpenFindingsDateRange(period);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const allowedStatuses = this.getStatusesForOpenFindingsGraph();

    const filtered = findings.filter((f) => {
      const openDate = new Date(f.openDate);
      openDate.setHours(0, 0, 0, 0);

      const hasValidOpenDate = openDate >= startDate && openDate <= endDate;

      return (
        allowedStatuses.includes(f.status as FindingStatus) && hasValidOpenDate
      );
    });

    const serviceMap: { [service: string]: { [category: string]: number } } =
      {};

    filtered.forEach((finding) => {
      const relevantServices = (finding.serviceDetails || []).filter(
        (service) =>
          !filteredServices.length || filteredServices.includes(service.id),
      );

      relevantServices.forEach((service) => {
        const serviceName = service.serviceName || 'Unknown';
        if (!serviceMap[serviceName]) serviceMap[serviceName] = {};
        const cat = finding.category || 'Unknown';
        serviceMap[serviceName][cat] = (serviceMap[serviceName][cat] || 0) + 1;
      });
    });

    const services: OpenFindingsStatistics[] = Object.entries(serviceMap).map(
      ([service, cats]) => ({
        service,
        categories: Object.entries(cats).map(([category, count]) => ({
          category,
          count,
        })) as OpenFindingsStatisticsDto[],
      }),
    );

    const data: OpenFindingsGraphData = { services };

    return {
      isSuccess: true,
      message: '',
      data,
      errorCode: '',
      __typename: 'OpenFindingsGraphDto',
    };
  }

  static buildFindingGraphsFilterSitesData(
    enrichedFindingItems: FindingListItemEnrichedDto[],
  ): FindingGraphsFilterSitesDataDto[] {
    const countryMap = new Map<string, Map<string, SiteDetailsMaster[]>>();
    let cityMap = new Map<string, SiteDetailsMaster[]>();

    enrichedFindingItems.forEach((item) => {
      (item.siteDetails || []).forEach((site) => {
        if (!site) {
          return;
        }

        if (!site.countryName || !site.city || !site.siteName) {
          return;
        }

        if (!countryMap.has(site.countryName)) {
          countryMap.set(site.countryName, new Map());
        }
        cityMap = countryMap.get(site.countryName)!;

        if (!cityMap.has(site.city)) {
          cityMap.set(site.city, []);
        }

        if (!(cityMap.get(site.city) ?? []).some((s) => s.id === site.id)) {
          cityMap.get(site.city)?.push(site);
        }
      });
    });

    let cityIdCounter = 1;
    const countryNodes: FindingGraphsFilterSitesDataDto[] = [];

    const sortedCountryEntries = Array.from(countryMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    sortedCountryEntries.forEach(([countryName, cityMapEntry]) => {
      const firstCitySites = Array.from(cityMapEntry.values())[0];
      const countryId =
        firstCitySites?.[0]?.countryId || Math.floor(Math.random() * 100000);

      const sortedCityEntries = Array.from(cityMapEntry.entries()).sort(
        (a, b) => a[0].localeCompare(b[0]),
      );
      const cityNodes: FindingGraphsFilterSitesDataDto[] = [];
      sortedCityEntries.forEach(([cityName, sites]) => {
        const cityId = cityIdCounter;
        cityIdCounter += 1;
        const sortedSites = [...sites].sort((a, b) =>
          a.siteName.localeCompare(b.siteName),
        );
        const siteNodes: FindingGraphsFilterSitesDataDto[] = sortedSites
          .map((site) => ({
            id: site.id,
            label: site.siteName,
          }))
          .filter(Boolean);

        cityNodes.push({
          id: cityId,
          label: cityName,
          children: siteNodes,
        });
      });

      countryNodes.push({
        id: countryId,
        label: countryName,
        children: cityNodes,
      });
    });

    return countryNodes.filter(Boolean);
  }

  static mapToChartFilterSites(
    data: FindingGraphsFilterSitesDataDto[] | undefined,
    depth = 0,
    parentIds: Set<number> = new Set(),
  ): CustomTreeNode[] {
    return (data || []).map((datum) => {
      if (parentIds.has(datum.id)) {
        return {
          data: datum.id,
          depth,
          key: `${datum.id}-${datum.label}`,
          label: datum.label,
          children: [],
        };
      }
      const nextParentIds = new Set(parentIds);
      nextParentIds.add(datum.id);

      return {
        data: datum.id,
        depth,
        key: `${datum.id}-${datum.label}`,
        label: datum.label,
        children: Array.isArray(datum.children)
          ? this.mapToChartFilterSites(datum.children, depth + 1, nextParentIds)
          : [],
      };
    });
  }

  static enrichFindingItems(
    findingItems: FindingListItemDto[],
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): FindingListItemEnrichedDto[] {
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const serviceMap = new Map(serviceMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    return findingItems.map((item) => {
      const siteDetails = this.mapSiteDetailsMaster(
        item.siteId,
        item.companyId,
        siteMap,
      );
      const serviceDetails = this.mapServiceDetails(item.services, serviceMap);
      const companyName = this.findCompanyName(item.companyId, companyMap);

      return {
        ...item,
        companyName,
        siteDetails,
        serviceDetails,
      };
    });
  }

  static findCompanyName(
    companyId: number,
    companyMap: Map<number, SiteMasterListItemModel>,
  ): string {
    return companyMap.get(companyId)?.companyName || '';
  }

  static mapSiteDetailsMaster(
    siteId: number,
    companyId: number,
    siteMap: Map<number, SiteMasterListItemModel>,
  ): SiteDetailsMaster[] {
    const site = siteMap.get(siteId);

    if (site && site.companyId === companyId) {
      return [
        {
          id: site.id,
          siteName: site.siteName,
          city: site.city,
          countryId: site.countryId,
          countryName: site.countryName,
          companyId: site.companyId,
          siteState: site.siteState,
          siteZip: site.siteZip,
          formattedAddress: site.formattedAddress,
        },
      ];
    }

    return [];
  }

  static mapServiceDetails(
    serviceIds: number[],
    serviceMap: Map<number, ServiceMasterListItemModel>,
  ): ServiceDetailsMaster[] {
    return (serviceIds || [])
      .map((serviceId) => {
        const service = serviceMap.get(serviceId);

        return service
          ? {
              id: service.id,
              serviceName: service.serviceName,
            }
          : undefined;
      })
      .filter(
        (service): service is ServiceDetailsMaster => service !== undefined,
      );
  }

  static buildDataCompanies(
    enrichedFindingItems: FindingListItemEnrichedDto[],
  ): { label: string; value: number }[] {
    const companyMap = new Map<number, string>();
    enrichedFindingItems.forEach((item) => {
      if (item.companyId && item.companyName) {
        companyMap.set(item.companyId, item.companyName);
      }
    });

    return Array.from(companyMap.entries())
      .map(([id, name]) => ({
        label: name,
        value: id,
      }))
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  static buildDataServices(
    enrichedFindingItems: FindingListItemEnrichedDto[],
  ): { label: string; value: number }[] {
    const serviceMap = new Map<number, string>();
    enrichedFindingItems.forEach((item) => {
      (item.serviceDetails || []).forEach((service) => {
        if (service?.id && service.serviceName) {
          serviceMap.set(service.id, service.serviceName);
        }
      });
    });

    return Array.from(serviceMap.entries())
      .map(([id, name]) => ({
        label: name,
        value: id,
      }))
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  static buildDataSites(
    enrichedFindingItems: FindingListItemEnrichedDto[],
  ): { label: string; value: number }[] {
    const siteMap = new Map<number, string>();
    enrichedFindingItems.forEach((item) => {
      (item.siteDetails || []).forEach((site) => {
        if (site?.id && site.siteName) {
          siteMap.set(site.id, site.siteName);
        }
      });
    });

    return Array.from(siteMap.entries())
      .map(([id, name]) => ({
        label: name,
        value: id,
      }))
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  static stripTypename(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map(FindingListGraphMapperService.stripTypename);
    }

    if (obj && typeof obj === 'object') {
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
      const { __typename, ...rest } = obj as Record<string, unknown>;
      const result: Record<string, unknown> = {};
      Object.keys(rest).forEach((key) => {
        result[key] = FindingListGraphMapperService.stripTypename(rest[key]);
      });

      return result;
    }

    return obj;
  }

  static generateFindingsByStatusGraphDto(
    findingList: FindingListItemEnrichedDto[],
  ): FindingsByStatusGraphDto {
    const totalFindings = findingList.length;

    const statusCounts: { [status: string]: number } = {};
    findingList.forEach((finding) => {
      statusCounts[finding.status] = (statusCounts[finding.status] || 0) + 1;
    });

    const stats: FindingStatusStatisticsDto[] = Object.entries(
      statusCounts,
    ).map(([status, count]) => ({
      status,
      count,
      percent:
        totalFindings > 0
          ? Math.round((count / totalFindings) * 10000) / 100
          : 0,
      __typename: 'StatusStat',
    }));

    return {
      data: {
        stats,
        totalFindings,
      },
      isSuccess: true,
      errorCode: '',
      message: '',
      __typename: 'FindingsByStatusGraphDto',
    };
  }

  static generateFindingStatusByCategoryGraphDto(
    findingItems: FindingListItemEnrichedDto[],
  ): FindingStatusByCategoryGraphDto {
    const categoryMap: { [category: string]: { [status: string]: number } } =
      {};

    findingItems.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = {};
      }
      categoryMap[item.category][item.status] =
        (categoryMap[item.category][item.status] || 0) + 1;
    });

    const stats: FindingStatusByCategoryStatistics[] = Object.entries(
      categoryMap,
    ).map(([category, statusCounts]) => ({
      category,
      statuses: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        __typename: 'StatusCount',
      })),
      __typename: 'CategoryStat',
    }));

    return {
      data: {
        stats,
      },
      isSuccess: true,
      errorCode: '',
      message: '',
      __typename: 'FindingStatusByCategoryGraphDto',
    };
  }

  static generateFindingsSiteResponse(
    findingItems: FindingListItemEnrichedDto[],
    siteIds: number[] = [],
  ): FindingsSiteResponse {
    if (!findingItems || findingItems.length === 0) {
      return {
        data: [],
        isSuccess: true,
        message: '',
        errorCode: '',
        __typename: 'BaseGraphResponseOfIEnumerableOfGetFindingBySiteResponse',
      };
    }
    const allCategories = Array.from(
      new Set(findingItems.map((item) => item.category).filter(Boolean)),
    );

    function getCategoryCounts(items: FindingListItemEnrichedDto[]) {
      return allCategories.map((category) => ({
        category,
        count: items.filter((i) => i.category === category).length,
      }));
    }

    const filteredFindings = siteIds.length
      ? findingItems.filter((item) =>
          (item.siteDetails || []).some((site) => siteIds.includes(site.id)),
        )
      : findingItems;

    const countryMap = new Map<
      string,
      {
        id: number;
        name: string;
        cities: Map<
          string,
          {
            sites: Map<
              number,
              {
                id: number;
                name: string;
                items: FindingListItemEnrichedDto[];
              }
            >;
            items: FindingListItemEnrichedDto[];
          }
        >;
        items: FindingListItemEnrichedDto[];
      }
    >();

    filteredFindings.forEach((item) => {
      (item.siteDetails || []).forEach((site) => {
        if (siteIds.length && !siteIds.includes(site.id)) return;

        if (!countryMap.has(site.countryName)) {
          countryMap.set(site.countryName, {
            id: site.countryId,
            name: site.countryName,
            cities: new Map(),
            items: [],
          });
        }
        const country = countryMap.get(site.countryName)!;
        country.items.push(item);

        if (!country.cities.has(site.city)) {
          country.cities.set(site.city, { sites: new Map(), items: [] });
        }
        const city = country.cities.get(site.city)!;
        city.items.push(item);

        if (!city.sites.has(site.id)) {
          city.sites.set(site.id, {
            id: site.id,
            name: site.siteName,
            items: [],
          });
        }
        const siteObj = city.sites.get(site.id)!;
        siteObj.items.push(item);
      });
    });

    const data = Array.from(countryMap.values()).map((country) => ({
      data: {
        id: country.id,
        name: country.name,
        categories: getCategoryCounts(country.items),
        totalCount: country.items.length,
        __typename: 'Countries',
      },
      children: Array.from(country.cities.entries()).map(
        ([cityName, city]) => ({
          data: {
            name: cityName,
            categories: getCategoryCounts(city.items),
            totalCount: city.items.length,
            __typename: 'Cities',
          },
          children: Array.from(city.sites.values()).map((site) => ({
            data: {
              id: site.id,
              name: site.name,
              categories: getCategoryCounts(site.items),
              totalCount: site.items.length,
              __typename: 'Site',
            },
            __typename: 'SiteList',
          })),
          __typename: 'CitiesList',
        }),
      ),
      __typename: 'GetFindingBySiteResponse',
    }));

    return {
      data,
      isSuccess: true,
      message: '',
      errorCode: '',
      __typename: 'BaseGraphResponseOfIEnumerableOfGetFindingBySiteResponse',
    };
  }

  static flattenCategoriesNode(node: any, parentKey = ''): TreeNode {
    const flatData = { ...node.data };
    (node.data.categories || []).forEach((catObj: any) => {
      flatData[catObj.category] = catObj.count;
    });
    delete flatData.categories;

    const key = parentKey + (flatData.id || flatData.name);

    return {
      ...node,
      key,
      data: flatData,
      children: (node.children || []).map((child: any) =>
        FindingListGraphMapperService.flattenCategoriesNode(child, `${key}-`),
      ),
    };
  }

  static flattenCategoriesClauseCategoryNode(
    node: any,
    allCategories: string[] = [],
  ): any {
    const newNode = { ...node, data: { ...node.data } };

    const categoryCountsMap: Record<string, number> = {};

    if (newNode.data && Array.isArray(newNode.data.categoryCounts)) {
      newNode.data.categoryCounts.forEach((cat: any) => {
        categoryCountsMap[cat.key] = cat.value;
      });
      delete newNode.data.categoryCounts;
    }

    allCategories.forEach((cat) => {
      newNode.data[cat] = categoryCountsMap[cat] ?? 0;
    });

    if (Array.isArray(newNode.children)) {
      newNode.children = newNode.children.map((child: any) =>
        FindingListGraphMapperService.flattenCategoriesClauseCategoryNode(
          child,
          allCategories,
        ),
      );
    }

    return newNode;
  }

  private static getDaysRangeForPeriod(period: OpenFindingsMonthsPeriod): {
    fromDays: number;
    toDays: number;
  } {
    const now = new Date();
    const { startDate, endDate } = getOpenFindingsDateRange(period);

    const fromDays = Math.floor(
      (now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const toDays = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return { fromDays, toDays };
  }
}
