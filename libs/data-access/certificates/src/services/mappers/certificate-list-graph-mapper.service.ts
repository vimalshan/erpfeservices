import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  CustomTreeNode,
  ServiceDetailsMaster,
  SiteDetailsMaster,
} from '@customer-portal/shared/models';

import {
  CertificateBySiteCity,
  CertificateBySiteCountry,
  CertificateBySiteServices,
  CertificateBySiteSite,
  CertificateGraphsFilterSitesDataDto,
  CertificateListItemDto,
  CertificateListItemEnrichedDto,
  CertificatesBySiteDto,
  CertificatesByStatusGraphDto,
  CertificatesByTypeGraphDto,
} from '../../dtos';

export class CertificateListGraphMapperService {
  static enrichCertificateItems(
    certificateItems: CertificateListItemDto[],
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): CertificateListItemEnrichedDto[] {
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const serviceMap = new Map(serviceMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    return certificateItems.map((item, _) => {
      const siteDetails = this.mapSiteDetails(
        item.siteIds,
        item.companyId,
        siteMap,
      );
      const serviceDetails = this.mapServiceDetails(
        item.serviceIds,
        serviceMap,
      );
      const companyName = this.findCompanyName(item.companyId, companyMap);

      return {
        ...item,
        companyName,
        siteDetails,
        serviceDetails,
      };
    });
  }

  static recalculateState(
    certificates: CertificateListItemEnrichedDto[],
    filterCompanies: number[],
    filterServices: number[],
    filterSites: number[],
    filterStartDate: Date | null,
    filterEndDate: Date | null,
  ) {
    const filterCompaniesSet = new Set(filterCompanies);
    const filterServicesSet = new Set(filterServices);
    const filterSitesSet = new Set(filterSites);

    const filtered = certificates.filter((item) => {
      const matchesCompany =
        !filterCompaniesSet.size || filterCompaniesSet.has(item.companyId);
      const matchesService =
        !filterServicesSet.size ||
        item.serviceDetails.some((s) => filterServicesSet.has(s.id));
      const matchesSite =
        !filterSitesSet.size ||
        item.siteDetails.some((s) => filterSitesSet.has(s.id));
      const startDate = new Date(item.issuedDate ?? '');
      const filterStartDateNorm = filterStartDate
        ? new Date(filterStartDate)
        : null;
      const filterEndDateNorm = filterEndDate ? new Date(filterEndDate) : null;

      startDate.setHours(0, 0, 0, 0);
      if (filterStartDateNorm) filterStartDateNorm.setHours(0, 0, 0, 0);
      if (filterEndDateNorm) filterEndDateNorm.setHours(0, 0, 0, 0);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const matchesDate =
        (!filterStartDateNorm || startDate >= filterStartDateNorm) &&
        (!filterEndDateNorm || startDate <= filterEndDateNorm);

      return matchesCompany && matchesService && matchesSite;
    });

    const dataCompanies = this.buildDataCompanies(filtered);
    const dataServices = this.buildDataServices(filtered);
    const sitesDto = this.buildCertificateGraphsFilterSitesData(filtered);
    const sortedSitesDto = [...sitesDto].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    const dataSites = this.mapToChartFilterSites(sortedSitesDto);

    return {
      certificateItems: filtered,
      dataCompanies,
      dataServices,
      dataSites,
    };
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
    enrichedCertificateItems: CertificateListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const companyMap = new Map<number, string>();
    enrichedCertificateItems.forEach((item) => {
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
    enrichedCertificateItems: CertificateListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const serviceMap = new Map<number, string>();
    enrichedCertificateItems.forEach((item) => {
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

  static buildCertificateGraphsFilterSitesData(
    enrichedCertificateItems: CertificateListItemEnrichedDto[],
  ): CertificateGraphsFilterSitesDataDto[] {
    const countryMap = new Map<string, Map<string, SiteDetailsMaster[]>>();
    let cityMap = new Map<string, SiteDetailsMaster[]>();

    enrichedCertificateItems.forEach((item) => {
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
    const countryNodes: CertificateGraphsFilterSitesDataDto[] = [];

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
      const cityNodes: CertificateGraphsFilterSitesDataDto[] = [];
      sortedCityEntries.forEach(([cityName, sites]) => {
        const cityId = cityIdCounter;
        cityIdCounter += 1;
        const sortedSites = [...sites].sort((a, b) =>
          a.siteName.localeCompare(b.siteName),
        );
        const siteNodes: CertificateGraphsFilterSitesDataDto[] = sortedSites
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

  static mapToChartFilterSitesold(
    data: CertificateGraphsFilterSitesDataDto[] | undefined,
    depth = 0,
  ): CustomTreeNode[] {
    return (data || []).map((datum) => ({
      data: datum.id,
      depth,
      key: `${datum.id}-${datum.label}`,
      label: datum.label,
      children: this.mapToChartFilterSitesold(datum.children, depth + 1),
    }));
  }

  static mapToChartFilterSites(
    data: CertificateGraphsFilterSitesDataDto[] | undefined,
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

  static buildCertificatesByStatusGraphDto(
    certificateItems: CertificateListItemEnrichedDto[],
  ): CertificatesByStatusGraphDto {
    const totalCertificates = certificateItems.length;
    const statusCountsMap: Record<string, number> = {};

    certificateItems.forEach((item) => {
      const { status } = item;
      statusCountsMap[status] = (statusCountsMap[status] || 0) + 1;
    });

    const statusCounts = Object.entries(statusCountsMap).map(
      ([status, count]) => ({
        status,
        count,
        percent: totalCertificates
          ? Number(((count / totalCertificates) * 100).toFixed(2))
          : 0,
        __typename: 'StatusCount',
      }),
    );

    return {
      data: {
        statusCounts,
        totalCertificates,
      },
    };
  }

  static buildCertificatesByTypeGraphDto(
    certificateItems: CertificateListItemEnrichedDto[],
    filteredServiceIds: number[] = [],
  ): CertificatesByTypeGraphDto {
    const serviceStatusMap: Record<
      string,
      { id: number; statuses: Record<string, number> }
    > = {};

    certificateItems.forEach((item) => {
      (item.serviceDetails || []).forEach((service) => {
        if (
          filteredServiceIds.length > 0 &&
          !filteredServiceIds.includes(service.id)
        ) {
          return;
        }
        const { serviceName, id } = service;

        if (!serviceStatusMap[serviceName]) {
          serviceStatusMap[serviceName] = { id, statuses: {} };
        }
        const { status } = item;
        serviceStatusMap[serviceName].statuses[status] =
          (serviceStatusMap[serviceName].statuses[status] || 0) + 1;
      });
    });

    const stats = Object.entries(serviceStatusMap).map(
      ([service, { statuses }]) => ({
        service,
        statuses: Object.entries(statuses).map(([status, count]) => ({
          status,
          count,
          __typename: 'SrvcStatusCount',
        })),
        __typename: 'SrvcCertStat',
      }),
    );

    return {
      data: {
        stats,
      },
    };
  }

  static buildCertificatesBySiteDto(
    certificateItems: CertificateListItemEnrichedDto[],
    filteredServiceIds: number[] = [],
    filteredSiteIds: number[] = [],
  ): CertificatesBySiteDto {
    const filteredCertificates = this.filterCertificatesBySiteAndService(
      certificateItems,
      filteredServiceIds,
      filteredSiteIds,
    );
    const serviceMap = this.buildServiceMap(
      filteredCertificates,
      filteredServiceIds,
    );
    const countryMap = this.buildCountryMap(
      filteredCertificates,
      filteredServiceIds,
      filteredSiteIds,
    );

    const countryArr = this.buildCountryArray(
      countryMap,
      serviceMap,
      filteredServiceIds,
    );

    return {
      data: {
        country: countryArr,
        services: Array.from(serviceMap.values()),
      },
    };
  }

  private static filterCertificatesBySiteAndService(
    certificateItems: CertificateListItemEnrichedDto[],
    filteredServiceIds: number[],
    filteredSiteIds: number[],
  ): CertificateListItemEnrichedDto[] {
    return certificateItems.filter((item) => {
      const hasSite =
        !filteredSiteIds.length ||
        item.siteDetails.some((site) => filteredSiteIds.includes(site.id));
      const hasService =
        !filteredServiceIds.length ||
        item.serviceDetails.some((service) =>
          filteredServiceIds.includes(service.id),
        );

      return hasSite && hasService;
    });
  }

  private static buildServiceMap(
    certificates: CertificateListItemEnrichedDto[],
    filteredServiceIds: number[],
  ): Map<number, CertificateBySiteServices> {
    const serviceMap = new Map<number, CertificateBySiteServices>();
    certificates.forEach((item) => {
      (item.serviceDetails || []).forEach((service) => {
        if (
          (!filteredServiceIds.length ||
            filteredServiceIds.includes(service.id)) &&
          !serviceMap.has(service.id)
        ) {
          serviceMap.set(service.id, {
            serviceId: service.id,
            serviceName: service.serviceName,
          });
        }
      });
    });

    return serviceMap;
  }

  private static buildCountryMap(
    certificates: CertificateListItemEnrichedDto[],
    filteredServiceIds: number[],
    filteredSiteIds: number[],
  ): Map<
    string,
    Map<string, Map<string, { site: SiteDetailsMaster; services: Set<number> }>>
  > {
    const countryMap = new Map<
      string,
      Map<
        string,
        Map<string, { site: SiteDetailsMaster; services: Set<number> }>
      >
    >();

    certificates.forEach((item) => {
      (item.siteDetails || []).forEach((site) => {
        if (filteredSiteIds.length && !filteredSiteIds.includes(site.id)) {
          return;
        }
        const countryName = site.countryName || 'Unknown Country';
        const cityName = site.city || 'Unknown City';
        const siteName = site.siteName || 'Unknown Site';

        if (!countryMap.has(countryName)) {
          countryMap.set(countryName, new Map());
        }
        const cityMap = countryMap.get(countryName)!;

        if (!cityMap.has(cityName)) {
          cityMap.set(cityName, new Map());
        }
        const siteMap = cityMap.get(cityName)!;

        if (!siteMap.has(siteName)) {
          siteMap.set(siteName, { site, services: new Set<number>() });
        }
        const siteEntry = siteMap.get(siteName)!;

        (item.serviceDetails || []).forEach((service) => {
          if (
            !filteredServiceIds.length ||
            filteredServiceIds.includes(service.id)
          ) {
            siteEntry.services.add(service.id);
          }
        });
      });
    });

    return countryMap;
  }

  private static buildCountryArray(
    countryMap: Map<
      string,
      Map<
        string,
        Map<string, { site: SiteDetailsMaster; services: Set<number> }>
      >
    >,
    serviceMap: Map<number, CertificateBySiteServices>,
    filteredServiceIds: number[],
  ): CertificateBySiteCountry[] {
    return Array.from(countryMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([countryName, cityMap]) => {
        const countryServicesSet = this.aggregateNestedServices(cityMap);

        const cities: CertificateBySiteCity[] = Array.from(cityMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([cityName, siteMap]) => {
            const cityServicesSet = this.aggregateServices(siteMap);

            const sites: CertificateBySiteSite[] = Array.from(siteMap.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([siteName, siteEntry]) => {
                const filteredServices = Array.from(siteEntry.services)
                  .filter(
                    (serviceId) =>
                      !filteredServiceIds.length ||
                      filteredServiceIds.includes(serviceId),
                  )
                  .map((serviceId) => serviceMap.get(serviceId)!)
                  .filter(Boolean);

                if (!filteredServices.length) return null;

                return {
                  siteName,
                  services: filteredServices,
                };
              })
              .filter(Boolean) as CertificateBySiteSite[];

            if (!sites.length) return null;

            return {
              cityName,
              sites,
              services: Array.from(cityServicesSet)
                .filter(
                  (serviceId) =>
                    !filteredServiceIds.length ||
                    filteredServiceIds.includes(serviceId),
                )
                .map((serviceId) => serviceMap.get(serviceId)!)
                .filter(Boolean),
            };
          })
          .filter(Boolean) as CertificateBySiteCity[];

        if (!cities.length) return null;

        return {
          countryName,
          cities,
          services: Array.from(countryServicesSet)
            .filter(
              (serviceId) =>
                !filteredServiceIds.length ||
                filteredServiceIds.includes(serviceId),
            )
            .map((serviceId) => serviceMap.get(serviceId)!)
            .filter(Boolean),
        };
      })
      .filter(Boolean) as CertificateBySiteCountry[];
  }

  private static aggregateServices<T extends { services: Set<number> }>(
    map: Map<any, T>,
  ): Set<number> {
    const servicesSet = new Set<number>();
    map.forEach((entry) => {
      entry.services.forEach((sid) => servicesSet.add(sid));
    });

    return servicesSet;
  }

  private static aggregateNestedServices(
    map: Map<any, Map<any, { services: Set<number> }>>,
  ): Set<number> {
    const servicesSet = new Set<number>();
    map.forEach((innerMap) => {
      innerMap.forEach((entry) => {
        entry.services.forEach((sid) => servicesSet.add(sid));
      });
    });

    return servicesSet;
  }
}
