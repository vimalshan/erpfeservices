import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { CardDataModel, CustomTreeNode } from '@customer-portal/shared/models';

import {
  OverviewCardListItemDto,
  OverviewCompanyServiceSiteFilterResponse,
} from '../../dtos';
import { OverviewCardPageInfoModel } from '../../models';

const SEQ_SERVICE_INFO_MAP: Record<number, { name: string; textInfo: string }> =
  {
    1: {
      name: 'Schedule',
      textInfo: 'overview.cardTexts.schedule',
    },
    2: {
      name: 'Audit',
      textInfo: 'overview.cardTexts.audits',
    },
    3: {
      name: 'Findings',
      textInfo: 'overview.cardTexts.findings',
    },
    4: {
      name: 'Certificates',
      textInfo: 'overview.cardTexts.certificates',
    },
  };

export class OverviewListMapperService {
  static buildDataCompanies(
    items: OverviewCompanyServiceSiteFilterResponse[],
    siteMasterList: SiteMasterListItemModel[],
  ): {
    companyMap: Map<number, string>;
    dataCompanies: SharedSelectMultipleDatum<number>[];
  } {
    const companyIds = Array.from(
      new Set(items.map((i) => i.companyId).filter((id) => id != null)),
    );
    const companyMap = new Map<number, string>();
    siteMasterList.forEach((site) => {
      if (
        site.companyId != null &&
        site.companyName &&
        companyIds.includes(site.companyId)
      ) {
        companyMap.set(site.companyId, site.companyName);
      }
    });

    const dataCompanies = companyIds
      .map((id) => ({
        label: companyMap.get(id) ?? `Company ${id}`,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return { companyMap, dataCompanies };
  }

  static buildDataServices(
    items: OverviewCompanyServiceSiteFilterResponse[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): {
    serviceMap: Map<number, string>;
    dataServices: SharedSelectMultipleDatum<number>[];
  } {
    const serviceIds = Array.from(new Set(items.map((i) => i.serviceId)));
    const serviceMap = new Map<number, string>();
    serviceMasterList.forEach((service) => {
      if (
        service.id != null &&
        service.serviceName &&
        serviceIds.includes(service.id)
      ) {
        serviceMap.set(service.id, service.serviceName);
      }
    });

    const dataServices = serviceIds
      .map((id) => ({
        label: serviceMap.get(id) ?? `Service ${id}`,
        value: id,
      }))
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label));

    return { serviceMap, dataServices };
  }

  static buildOverviewFiltersSitesData(
    items: OverviewCompanyServiceSiteFilterResponse[],
    siteMasterList: SiteMasterListItemModel[],
  ) {
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const countryMap = new Map<
      string,
      Map<string, SiteMasterListItemModel[]>
    >();

    items.forEach((item) => {
      const site = siteMap.get(item.siteId);
      if (!site) return;

      if (!countryMap.has(site.countryName)) {
        countryMap.set(site.countryName, new Map());
      }
      const cityMap = countryMap.get(site.countryName)!;

      if (!cityMap.has(site.city)) {
        cityMap.set(site.city, []);
      }

      if (!(cityMap.get(site.city) ?? []).some((s) => s.id === site.id)) {
        cityMap.get(site.city)?.push(site);
      }
    });

    let cityIdCounter = 1;
    const countryNodes: { id: number; label: string; children: any[] }[] = [];

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
      const cityNodes: { id: number; label: string; children: any[] }[] = [];
      sortedCityEntries.forEach(([cityName, sites]) => {
        const cityId = cityIdCounter;
        cityIdCounter += 1;
        const sortedSites = [...sites].sort((a, b) =>
          a.siteName.localeCompare(b.siteName),
        );
        const siteNodes = sortedSites
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

  static mapToOverviewFilterSites(
    data: any[] | undefined,
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
          ? this.mapToOverviewFilterSites(
              datum.children,
              depth + 1,
              nextParentIds,
            )
          : [],
      };
    });
  }

  static buildDataSites(
    items: OverviewCompanyServiceSiteFilterResponse[],
    siteMasterList: SiteMasterListItemModel[],
  ): CustomTreeNode[] {
    const sitesDto = this.buildOverviewFiltersSitesData(items, siteMasterList);
    const sortedSitesDto = [...sitesDto].sort((a, b) =>
      a.label.localeCompare(b.label),
    );

    return this.mapToOverviewFilterSites(sortedSitesDto);
  }

  static calculateOverviewFilters(
    items: OverviewCompanyServiceSiteFilterResponse[],
    serviceMasterList: ServiceMasterListItemModel[],
    siteMasterList: SiteMasterListItemModel[],
  ) {
    const { companyMap, dataCompanies } = this.buildDataCompanies(
      items,
      siteMasterList,
    );
    const { serviceMap, dataServices } = this.buildDataServices(
      items,
      serviceMasterList,
    );
    const dataSites = this.buildDataSites(items, siteMasterList);

    const siteIds = Array.from(
      new Set(items.map((i) => i.siteId).filter((id) => id != null)),
    );
    const siteMap = new Map<number, string>();
    siteMasterList.forEach((site) => {
      if (site.id != null && siteIds.includes(site.id)) {
        siteMap.set(site.id, site.siteName);
      }
    });

    return {
      dataCompanies,
      dataServices,
      dataSites,
      companyMap,
      serviceMap,
      siteMap,
    };
  }

  static resetOverviewFilters(
    companyMap: Map<number, string>,
    serviceMap: Map<number, string>,
    items: OverviewCompanyServiceSiteFilterResponse[],
    siteMasterList: SiteMasterListItemModel[],
  ) {
    const companyIds = Array.from(companyMap.keys());
    const dataCompanies = companyIds
      .map((id) => ({
        label: companyMap.get(id) ?? `Company ${id}`,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const serviceIds = Array.from(serviceMap.keys());
    const dataServices = serviceIds
      .map((id) => ({
        label: serviceMap.get(id) ?? `Service ${id}`,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const dataSites = this.buildDataSites(items, siteMasterList);

    return {
      dataCompanies,
      dataServices,
      dataSites,
    };
  }

  static buildEntityRelations(
    items: OverviewCompanyServiceSiteFilterResponse[],
  ): {
    companyToServices: Map<number, Set<number>>;
    companyToSites: Map<number, Set<number>>;
    serviceToCompanies: Map<number, Set<number>>;
    serviceToSites: Map<number, Set<number>>;
    siteToCompanies: Map<number, Set<number>>;
    siteToServices: Map<number, Set<number>>;
  } {
    const companyToServices = new Map<number, Set<number>>();
    const companyToSites = new Map<number, Set<number>>();
    const serviceToCompanies = new Map<number, Set<number>>();
    const serviceToSites = new Map<number, Set<number>>();
    const siteToCompanies = new Map<number, Set<number>>();
    const siteToServices = new Map<number, Set<number>>();

    items.forEach((item) => {
      if (item.companyId != null) {
        if (!companyToServices.has(item.companyId))
          companyToServices.set(item.companyId, new Set());
        if (!companyToSites.has(item.companyId))
          companyToSites.set(item.companyId, new Set());
        if (item.serviceId != null)
          companyToServices.get(item.companyId)!.add(item.serviceId);
        if (item.siteId != null)
          companyToSites.get(item.companyId)!.add(item.siteId);
      }

      if (item.serviceId != null) {
        if (!serviceToCompanies.has(item.serviceId))
          serviceToCompanies.set(item.serviceId, new Set());
        if (!serviceToSites.has(item.serviceId))
          serviceToSites.set(item.serviceId, new Set());
        if (item.companyId != null)
          serviceToCompanies.get(item.serviceId)!.add(item.companyId);
        if (item.siteId != null)
          serviceToSites.get(item.serviceId)!.add(item.siteId);
      }

      if (item.siteId != null) {
        if (!siteToCompanies.has(item.siteId))
          siteToCompanies.set(item.siteId, new Set());
        if (!siteToServices.has(item.siteId))
          siteToServices.set(item.siteId, new Set());
        if (item.companyId != null)
          siteToCompanies.get(item.siteId)!.add(item.companyId);
        if (item.serviceId != null)
          siteToServices.get(item.siteId)!.add(item.serviceId);
      }
    });

    return {
      companyToServices,
      companyToSites,
      serviceToCompanies,
      serviceToSites,
      siteToCompanies,
      siteToServices,
    };
  }

  static mapToOverviewCardModel(
    dto: OverviewCardListItemDto,
  ): CardDataModel[] | null {
    if (!dto || !dto.data?.length) {
      return null;
    }

    return dto.data.map((item) => ({
      cardData: {
        service: item.serviceName,
        yearlyData: item.yearData.map((yearItem, yearIndex) => ({
          year: {
            label: yearItem.year.toString(),
            index: yearIndex,
          },
          details: yearItem.values.map((value) => ({
            entity: SEQ_SERVICE_INFO_MAP[value.seq]?.name,
            entityTranslationKey: SEQ_SERVICE_INFO_MAP[value.seq]?.textInfo,
            stats: {
              currentValue: value.count,
              maxValue: value.totalCount,
              percentage: (value.count * 100) / value.totalCount || 0,
            },
          })),
        })),
      },
    }));
  }

  static mapToPageInfo(
    dto: OverviewCardListItemDto,
  ): OverviewCardPageInfoModel {
    if (!dto || !dto.data?.length) {
      return {
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
      };
    }

    const { currentPage, totalItems, totalPages } = dto;

    return {
      currentPage,
      totalItems,
      totalPages,
    };
  }
}
