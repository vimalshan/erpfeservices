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
  ScheduleListCalendarFilterSitesDataDto,
  ScheduleListItemDto,
  ScheduleListItemEnrichedDto,
} from '../../dtos';
import { CalendarScheduleModel } from '../../models';

export class ScheduleListCalendarMapperService {
  static statusMap: Record<string, number> = {
    Confirmed: 2,
    'To Be Confirmed': 7,
    'To Be Confirmed By DNV': 8,
  };

  static enrichScheduleItems(
    scheduleItems: ScheduleListItemDto[],
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): ScheduleListItemEnrichedDto[] {
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const serviceMap = new Map(serviceMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    return scheduleItems.map((item, _) => {
      const siteDetails = this.mapSiteDetails(
        [item.siteId],
        item.companyId,
        siteMap,
      );
      const serviceDetails = this.mapServiceDetails(
        item.serviceIds,
        serviceMap,
      );
      const companyName = this.findCompanyName(item.companyId, companyMap);
      const statusId = this.statusMap[item.status] ?? null;

      return {
        ...item,
        companyName,
        siteDetails,
        serviceDetails,
        statusId,
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

  static recalculateState(
    schedules: ScheduleListItemEnrichedDto[],
    filterCompanies: number[],
    filterServices: number[],
    filterSites: number[],
    filterStatuses: number[],
  ) {
    const filterCompaniesSet = new Set(filterCompanies);
    const filterServicesSet = new Set(filterServices);
    const filterSitesSet = new Set(filterSites);
    const filterStatusesSet = new Set(filterStatuses);

    const filtered = schedules.filter((item) => {
      const matchesCompany =
        !filterCompaniesSet.size || filterCompaniesSet.has(item.companyId);

      const matchesService =
        !filterServicesSet.size ||
        (item.serviceDetails || []).some((s) => filterServicesSet.has(s.id));

      const matchesSite =
        !filterSitesSet.size ||
        (item.siteDetails || []).some((s) => filterSitesSet.has(s.id));

      const matchesStatus =
        !filterStatusesSet.size || filterStatusesSet.has(item.statusId);

      return matchesCompany && matchesService && matchesSite && matchesStatus;
    });

    const dataCompanies = this.buildDataCompanies(filtered);
    const dataServices = this.buildDataServices(filtered);
    const sitesDto = this.buildFilterSitesData(filtered);
    const sortedSitesDto = [...sitesDto].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
    const dataSites = this.mapToCalendarFilterSites(sortedSitesDto);

    const dataStatuses = this.buildDataStatuses(filtered);

    return {
      scheduleItems: filtered,
      dataCompanies,
      dataServices,
      dataSites,
      dataStatuses,
    };
  }

  static matchesScheduleDate(
    startDateStr: string,
    endDateStr: string,
    month: number,
    year: number,
  ): boolean {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    let matchesDate = false;

    if (month === 0) {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      matchesDate =
        year === startYear ||
        year === endYear ||
        (year >= startYear && year <= endYear);
    } else {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;
      const afterStart =
        year > startYear || (year === startYear && month >= startMonth);
      const beforeEnd =
        year < endYear || (year === endYear && month <= endMonth);
      matchesDate = afterStart && beforeEnd;
    }

    return matchesDate;
  }

  static buildDataCompanies(
    enrichedScheduleItems: ScheduleListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const companyMap = new Map<number, string>();
    enrichedScheduleItems.forEach((item) => {
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

  static buildDataStatuses(
    enrichedScheduleItems: ScheduleListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const idToLabel = Object.entries(this.statusMap).reduce(
      (acc, [label, id]) => ({ ...acc, [id]: label }),
      {} as Record<number, string>,
    );

    const statusSet = new Set<number>();
    enrichedScheduleItems.forEach((item) => {
      if (item.statusId) {
        statusSet.add(item.statusId);
      }
    });

    return Array.from(statusSet)
      .filter((id) => idToLabel[id])
      .map((id) => ({
        value: id,
        label: idToLabel[id],
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  static buildDataServices(
    enrichedScheduleItems: ScheduleListItemEnrichedDto[],
  ): SharedSelectMultipleDatum<number>[] {
    const serviceMap = new Map<number, string>();
    enrichedScheduleItems.forEach((item) => {
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

  static buildFilterSitesData(
    enrichedScheduleItems: ScheduleListItemEnrichedDto[],
  ): ScheduleListCalendarFilterSitesDataDto[] {
    const countryMap = new Map<string, Map<string, SiteDetailsMaster[]>>();
    let cityMap = new Map<string, SiteDetailsMaster[]>();

    enrichedScheduleItems.forEach((item) => {
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
    const countryNodes: ScheduleListCalendarFilterSitesDataDto[] = [];

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
      const cityNodes: ScheduleListCalendarFilterSitesDataDto[] = [];
      sortedCityEntries.forEach(([cityName, sites]) => {
        const cityId = cityIdCounter;
        cityIdCounter += 1;
        const sortedSites = [...sites].sort((a, b) =>
          a.siteName.localeCompare(b.siteName),
        );
        const siteNodes: ScheduleListCalendarFilterSitesDataDto[] = sortedSites
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

  static mapToCalendarFilterSites(
    data: ScheduleListCalendarFilterSitesDataDto[] | undefined,
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
          ? this.mapToCalendarFilterSites(
              datum.children,
              depth + 1,
              nextParentIds,
            )
          : [],
      };
    });
  }

  static mapToCalendarScheduleModel(
    schedules: ScheduleListItemEnrichedDto[],
  ): CalendarScheduleModel[] {
    const SITE_REPRESENTATIVES_DELIMITER = ', ';

    return schedules.map((item) => {
      const site = item.siteDetails?.[0];
      const siteName = site?.siteName ?? '';
      const companyName = item.companyName ?? '';
      const services = (item.serviceDetails || [])
        .map((s) => s.serviceName)
        .filter(Boolean)
        .join(', ');

      return {
        address: site?.formattedAddress ?? item.siteAddress ?? '',
        auditType: item.auditType ?? '',
        city: site?.city ?? '',
        company: companyName,
        endDate: item.endDate,
        leadAuditor: item.leadAuditor ?? '',
        scheduleId: String(item.siteAuditId),
        service: services,
        site: siteName,
        siteRepresentative: (item.siteRepresentatives || []).join(
          SITE_REPRESENTATIVES_DELIMITER,
        ),
        startDate: item.startDate,
        status: item.status ?? '',
        auditID: item.auditID,
        siteAuditId: item.siteAuditId,
        siteAddress: site?.formattedAddress ?? '',
        siteZip: site?.siteZip ?? '',
        siteCountry: site?.countryName ?? '',
        siteState: site?.siteState ?? '',
        reportingCountry: item.reportingCountry ?? '',
        projectNumber: item.projectNumber ?? '',
        accountDNVId: item.accountDNVId ?? 0,
      };
    });
  }
}
