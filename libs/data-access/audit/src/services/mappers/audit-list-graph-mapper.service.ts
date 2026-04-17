import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { CustomTreeNode } from '@customer-portal/shared/models';
import {
  ServiceDetailsMaster,
  SiteDetailsMaster,
} from '@customer-portal/shared/models/master';

import {
  AuditByTypeStatistics,
  AuditGraphsFilterSitesDataDto,
  AuditListItemDto,
  AuditListItemEnrichedDto,
  AuditsStatusDoughnutGraphDto,
  AuditStatisticsDto,
  AuditStatusBarGraphDto,
} from '../../dtos';

export class AuditListGraphMapperService {
  static enrichAuditItems(
    auditItems: AuditListItemDto[],
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): AuditListItemEnrichedDto[] {
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const serviceMap = new Map(serviceMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    return auditItems.map((item, _) => {
      const siteDetails = this.mapSiteDetails(
        item.sites,
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

  static mapSiteDetails(
    siteIds: number[],
    companyId: number,
    siteMap: Map<number, SiteMasterListItemModel>,
  ): SiteDetailsMaster[] {
    return (siteIds || [])
      .map((siteId: number) => {
        const site = siteMap.get(siteId);

        return site && site.companyId === companyId
          ? {
              id: site.id,
              siteName: site.siteName,
              city: site.city,
              countryId: site.countryId,
              countryName: site.countryName,
              companyId: site.companyId,
            }
          : undefined;
      })
      .filter((site): site is SiteDetailsMaster => site !== undefined);
  }

  static mapServiceDetails(
    serviceIds: number[],
    serviceMap: Map<number, ServiceMasterListItemModel>,
  ): ServiceDetailsMaster[] {
    return (serviceIds || [])
      .map((serviceId: number) => {
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
    enrichedAuditItems: AuditListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const companyMap = new Map<number, string>();
    enrichedAuditItems.forEach((item) => {
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
    enrichedAuditItems: AuditListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const serviceMap = new Map<number, string>();
    enrichedAuditItems.forEach((item) => {
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

  static buildAuditGraphsFilterSitesData(
    enrichedAuditItems: AuditListItemEnrichedDto[],
  ): AuditGraphsFilterSitesDataDto[] {
    const countryMap = new Map<string, Map<string, SiteDetailsMaster[]>>();
    let cityMap = new Map<string, SiteDetailsMaster[]>();

    enrichedAuditItems.forEach((item) => {
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
    const countryNodes: AuditGraphsFilterSitesDataDto[] = [];

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
      const cityNodes: AuditGraphsFilterSitesDataDto[] = [];
      sortedCityEntries.forEach(([cityName, sites]) => {
        const cityId = cityIdCounter;
        cityIdCounter += 1;
        const sortedSites = [...sites].sort((a, b) =>
          a.siteName.localeCompare(b.siteName),
        );
        const siteNodes: AuditGraphsFilterSitesDataDto[] = sortedSites
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
    data: AuditGraphsFilterSitesDataDto[] | undefined,
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

  static recalculateState(
    audits: AuditListItemEnrichedDto[],
    filterCompanies: number[],
    filterServices: number[],
    filterSites: number[],
    filterStartDate: Date | null,
    filterEndDate: Date | null,
  ) {
    const filterCompaniesSet = new Set(filterCompanies);
    const filterServicesSet = new Set(filterServices);
    const filterSitesSet = new Set(filterSites);

    const filtered = audits.filter((item) => {
      const matchesCompany =
        !filterCompaniesSet.size || filterCompaniesSet.has(item.companyId);
      const matchesService =
        !filterServicesSet.size ||
        item.serviceDetails.some((s) => filterServicesSet.has(s.id));
      const matchesSite =
        !filterSitesSet.size ||
        item.siteDetails.some((s) => filterSitesSet.has(s.id));
      const startDate = new Date(item.startDate ?? '');
      const filterStartDateNorm = filterStartDate
        ? new Date(filterStartDate)
        : null;
      const filterEndDateNorm = filterEndDate ? new Date(filterEndDate) : null;

      startDate.setHours(0, 0, 0, 0);
      if (filterStartDateNorm) filterStartDateNorm.setHours(0, 0, 0, 0);
      if (filterEndDateNorm) filterEndDateNorm.setHours(0, 0, 0, 0);

      const matchesDate =
        (!filterStartDateNorm || startDate >= filterStartDateNorm) &&
        (!filterEndDateNorm || startDate <= filterEndDateNorm);

      return matchesCompany && matchesService && matchesSite && matchesDate;
    });

    const dataCompanies = this.buildDataCompanies(filtered);
    const dataServices = this.buildDataServices(filtered);
    const sitesDto = this.buildAuditGraphsFilterSitesData(filtered);
    const sortedSitesDto = [...sitesDto].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    const dataSites = this.mapToChartFilterSites(sortedSitesDto);

    return { auditItems: filtered, dataCompanies, dataServices, dataSites };
  }

  static hasCycle(
    nodes: AuditGraphsFilterSitesDataDto[],
    seen = new Set<number>(),
  ): boolean {
    return nodes.some((node) => {
      if (seen.has(node.id)) {
        return true;
      }
      const nextSeen = new Set(seen);
      nextSeen.add(node.id);

      if (Array.isArray(node.children) && node.children.length > 0) {
        if (AuditListGraphMapperService.hasCycle(node.children, nextSeen)) {
          return true;
        }
      }

      return false;
    });
  }

  static getDateFilteredAudits(
    audits: AuditListItemEnrichedDto[],
    filterStartDate: Date,
    filterEndDate: Date,
  ): AuditListItemEnrichedDto[] {
    const filtered = audits.filter((item) => {
      const startDate = new Date(item.startDate ?? '');
      const endDate = new Date(item.endDate ?? '');
      const matchesDate =
        (!filterStartDate || startDate >= filterStartDate) &&
        (!filterEndDate || endDate <= filterEndDate);

      return matchesDate;
    });

    return filtered;
  }

  static calculateAuditStatusStats(
    audits: AuditListItemEnrichedDto[],
  ): AuditsStatusDoughnutGraphDto {
    const statusMap = audits.reduce(
      (acc, audit) => {
        acc[audit.status] = (acc[audit.status] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    const totalAudits = audits.length;
    const stats: AuditStatisticsDto[] = Object.entries(statusMap)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        count,
        percent: Number(((count / totalAudits) * 100).toFixed(2)),
      }));

    return {
      data: {
        stats,
        totalAudits,
      },
    };
  }

  static calculateAuditByTypeStatusStats(
    auditList: AuditListItemEnrichedDto[],
  ): AuditStatusBarGraphDto {
    const auditsByType = auditList.reduce(
      (acc, audit) => {
        if (!acc[audit.type]) {
          acc[audit.type] = [];
        }
        acc[audit.type].push(audit);

        return acc;
      },
      {} as Record<string, AuditListItemEnrichedDto[]>,
    );

    const stats: AuditByTypeStatistics[] = Object.entries(auditsByType).map(
      ([type, audits]) => {
        const statusCounts = audits.reduce(
          (acc, audit) => {
            acc[audit.status] = (acc[audit.status] || 0) + 1;

            return acc;
          },
          {} as Record<string, number>,
        );

        const statuses: AuditStatisticsDto[] = Object.entries(statusCounts).map(
          ([status, count]) => ({
            status,
            count,
          }),
        );

        return {
          type,
          statuses,
        };
      },
    );

    return {
      data: {
        stats,
      },
    };
  }
}
