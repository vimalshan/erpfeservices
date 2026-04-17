import { TreeNode } from 'primeng/api';

import {
  COLUMN_DELIMITER,
  CompanyModel,
  EventActionItem,
  GridEventActionType,
  SiteModel,
} from '@customer-portal/shared';

import {
  City,
  Country,
  SettingsAdminListDto,
  SettingsAdminListItemDto,
  SettingsMembersListDto,
  SettingsMembersListItemDto,
} from '../../dtos';
import {
  CreateContactCompany,
  SettingsMembersItemModel,
  SettingsMembersPermissionsDataModel,
} from '../../models';

const extractUniqueSiteNames = (countries: Country[]): string[] => {
  const siteNamesSet = new Set<string>();

  countries.forEach((country) => {
    country.cities.forEach((city) => {
      city.sites.forEach((site) => {
        siteNamesSet.add(site.siteName);
      });
    });
  });

  return Array.from(siteNamesSet);
};

const extractUniqueCompanyNames = (companies: CompanyModel[]) =>
  Array.from(new Set(companies.map((company) => company.companyName)));

const isUserPendingVerification = (userStatus: string) =>
  userStatus.toLowerCase() === 'in progress';

const createNode = (
  data: string | number,
  label: string,
  key: string,
  checked = false,
  children: TreeNode[] = [],
): TreeNode => ({
  data,
  label,
  key,
  children,
  checked,
});

const mapSitesToNodes = (sites: SiteModel[]): TreeNode[] =>
  sites.map((site) => {
    const siteNode = createNode(
      site.siteId!,
      site.siteName,
      `${site.siteId!}-${site.siteName}`,
      site.isSiteSelected,
    );

    return siteNode;
  });

const mapCitiesToNodes = (cities: City[]): TreeNode[] =>
  cities.map((city) => {
    const cityNode = createNode(
      city.cityName,
      city.cityName,
      `${city.cityName}-city`,
      city.isCitySelected,
    );
    cityNode.children = mapSitesToNodes(city.sites);

    return cityNode;
  });

const mapCountriesToNodes = (countries: Country[]): TreeNode[] =>
  countries.map((country) => {
    const countryNode = createNode(
      country.countryId,
      country.countryName,
      `${country.countryId}-${country.countryName}`,
      country.isCountrySelected,
    );
    countryNode.children = mapCitiesToNodes(country.cities);

    return countryNode;
  });

export class SettingsMembersMapper {
  static mapToMembersList(
    dto: SettingsMembersListDto,
    accountDnvId: string | null,
  ): SettingsMembersItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((member: SettingsMembersListItemDto) => {
      const services = Array.from(
        new Set(
          member.services.map((auditService) => auditService.serviceName),
        ),
      ).join(COLUMN_DELIMITER);

      const companies = extractUniqueCompanyNames(member.companies).join(
        COLUMN_DELIMITER,
      );

      const sites = extractUniqueSiteNames(member.countries).join(
        COLUMN_DELIMITER,
      );

      const {
        name,
        email,
        userStatus,
        roles: access,
        canDelete,
        canManagePermissions,
      } = member;

      return {
        name,
        email,
        company: companies,
        services,
        sites,
        access,
        iconTooltip: {
          displayIcon: isUserPendingVerification(userStatus),
          iconClass: 'pi pi-info-circle',
          iconPosition: 'suffix',
          tooltipMessage: 'settings.membersTab.pendingVerification',
        },
        isDisabled: isUserPendingVerification(userStatus),
        eventActions:
          !isUserPendingVerification(userStatus) &&
          (canManagePermissions || canDelete)
            ? {
                id: email,
                actions: SettingsMembersMapper.getActions(
                  accountDnvId,
                  canManagePermissions,
                  canDelete,
                ),
              }
            : undefined,
      };
    });
  }

  static mapToAdminList(
    dto: SettingsAdminListDto,
    accountDnvId: string | null,
  ): SettingsMembersItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((admin: SettingsAdminListItemDto) => {
      const company = extractUniqueCompanyNames(admin.companies).join(
        COLUMN_DELIMITER,
      );

      const {
        name,
        email,
        userStatus,
        isCurrentUser,
        canDelete,
        canManagePermissions,
      } = admin;

      return {
        name,
        email,
        company,
        services: 'All Services',
        sites: 'All Sites',
        access: 'Admin',
        isDisabled: isUserPendingVerification(userStatus),
        iconTooltip: {
          displayIcon: isUserPendingVerification(userStatus),
          iconClass: 'pi pi-info-circle',
          iconPosition: 'suffix',
          tooltipMessage: 'settings.membersTab.pendingVerification',
        },
        eventActions:
          !isUserPendingVerification(userStatus) &&
          !isCurrentUser &&
          (canManagePermissions || canDelete)
            ? {
                id: email,
                name,
                actions: SettingsMembersMapper.getActions(
                  accountDnvId,
                  canManagePermissions,
                  canDelete,
                ),
              }
            : undefined,
      };
    });
  }

  static mapToMemberCompanies(
    data: SettingsMembersPermissionsDataModel,
  ): TreeNode[] {
    const companies = data.data.flatMap((d) =>
      d.companies.map((company) => ({
        data: company.companyId,
        label: company.companyName,
        key: `${company.companyId}-${company.companyName}`,
        hasParentId: company.hasParentId,
        parentId: company.parentId,
        checked: company.isCompanySelected,
        children: [] as TreeNode[],
      })),
    );

    const parentCompanies: typeof companies = [];
    const childCompanies: typeof companies = [];

    companies.forEach((company) => {
      if (company.hasParentId) {
        childCompanies.push(company);
      } else {
        parentCompanies.push(company);
      }
    });

    childCompanies.forEach((child) => {
      const parentIdx = parentCompanies.findIndex(
        (parent) => child.parentId === parent.data,
      );

      if (parentIdx !== -1) {
        parentCompanies[parentIdx].children.push(child);
      } else {
        parentCompanies.push(child);
      }
    });

    return parentCompanies;
  }

  static mapToMemberServices(
    data: SettingsMembersPermissionsDataModel,
    selectedCompanyIds: number[],
  ): TreeNode[] {
    const services: TreeNode[] = [];

    data.data.forEach((d) => {
      d.companies.forEach((company) => {
        company.services.forEach((service) => {
          if (
            selectedCompanyIds.includes(company.companyId) &&
            !services.some((s) => s.data === service.serviceId)
          ) {
            services.push({
              data: service.serviceId,
              label: service.serviceName,
              key: `${service.serviceId}-${service.serviceName}`,
              checked: service.isServiceSelected,
              children: [],
            });
          }
        });
      });
    });

    return services;
  }

  static mapToMemberSites(
    data: SettingsMembersPermissionsDataModel,
    selectedServiceIds: number[],
    selectedCompanyIds: number[],
  ): TreeNode[] {
    const countryMap = new Map<string | number, Country>();
    const countries = data.data.flatMap((d) =>
      d.companies
        .filter((company) => selectedCompanyIds.includes(company.companyId))
        .flatMap((company) =>
          company.services.flatMap((service) =>
            selectedServiceIds.includes(service.serviceId)
              ? service.countries
              : [],
          ),
        ),
    );

    countries.forEach((country) => {
      if (!countryMap.has(country.countryName)) {
        countryMap.set(country.countryName, { ...country, cities: [] });
      }
      const existingCountry = countryMap.get(country.countryName)!;
      country.cities.forEach((city) => {
        const existingCity = existingCountry.cities.find(
          (c) => c.cityName === city.cityName,
        );

        if (existingCity) {
          existingCity.sites = [...existingCity.sites, ...city.sites].filter(
            (site, index, self) =>
              index === self.findIndex((s) => s.siteId === site.siteId),
          );
        } else {
          existingCountry.cities.push({
            ...city,
            sites: [...city.sites],
          });
        }
      });
    });

    const mergedCountries = Array.from(countryMap.values());

    return mapCountriesToNodes(mergedCountries);
  }

  static mapToSelectedCompanies = (
    data: SettingsMembersPermissionsDataModel,
    selectedCompanyIds: number[],
  ): CreateContactCompany[] =>
    data.data
      .flatMap((d) => d.companies)
      .filter((company) => selectedCompanyIds.includes(company.companyId))
      .map((company) => ({
        companyId: company.companyId,
        companyName: company.companyName,
      }));

  static mapToSelectedServices = (
    data: SettingsMembersPermissionsDataModel,
    selectedServiceIds: number[],
  ): { serviceId: number; serviceName: string }[] => {
    const uniqueServicesMap = new Map<
      number,
      { serviceId: number; serviceName: string }
    >();

    data.data
      .flatMap((d) => d.companies)
      .flatMap((company) => company.services)
      .forEach((service) => {
        if (
          selectedServiceIds.includes(service.serviceId) &&
          !uniqueServicesMap.has(service.serviceId)
        ) {
          uniqueServicesMap.set(service.serviceId, {
            serviceId: service.serviceId,
            serviceName: service.serviceName,
          });
        }
      });

    return Array.from(uniqueServicesMap.values());
  };

  static mapToSelectedSites = (
    data: SettingsMembersPermissionsDataModel,
    selectedSiteIds: (string | number)[],
  ): any[] => {
    const countryMap = new Map<
      number,
      { countryId: number; countryName: string; cities: any[] }
    >();

    data.data.forEach((user) => {
      user.companies.forEach((company) => {
        company.services.forEach((service) => {
          service.countries.forEach((country) => {
            if (!countryMap.has(country.countryId)) {
              countryMap.set(country.countryId, {
                countryId: country.countryId,
                countryName: country.countryName,
                cities: [],
              });
            }
            const countryEntry = countryMap.get(country.countryId)!;
            country.cities.forEach((city) => {
              let cityEntry = countryEntry.cities.find(
                (c) => c.cityName === city.cityName,
              );

              if (!cityEntry) {
                cityEntry = { cityName: city.cityName, sites: [] };
                countryEntry.cities.push(cityEntry);
              }

              const existingSiteIds = new Set(
                cityEntry.sites.map((s: any) => s.siteId),
              );

              city.sites.forEach((site) => {
                if (
                  selectedSiteIds.includes(site.siteId ?? '') &&
                  !existingSiteIds.has(site.siteId)
                ) {
                  cityEntry.sites.push({
                    siteId: site.siteId,
                    siteName: site.siteName,
                  });
                  existingSiteIds.add(site.siteId);
                }
              });
            });
          });
        });
      });
    });

    return Array.from(countryMap.values())
      .map((country) => ({
        ...country,
        cities: country.cities.filter((city) => city.sites.length > 0),
      }))
      .filter((country) => country.cities.length > 0);
  };

  public static getActions(
    accountDnvId: string | null,
    canManagePermissions: boolean,
    canDelete: boolean,
  ): EventActionItem[] {
    return [
      ...(accountDnvId
        ? [
            {
              label: GridEventActionType.ViewPortalAs,
              i18nKey: `gridEvent.${GridEventActionType.ViewPortalAs}`,
              icon: 'pi pi-eye',
              disabled: false,
            },
          ]
        : []),
      {
        label: GridEventActionType.ManagePermissions,
        i18nKey: `gridEvent.${GridEventActionType.ManagePermissions}`,
        icon: 'pi pi-lock',
        disabled: !canManagePermissions,
      },
      {
        label: GridEventActionType.Remove,
        i18nKey: `gridEvent.${GridEventActionType.Remove}`,
        icon: 'pi pi-trash',
        disabled: !canDelete,
      },
    ];
  }
}
