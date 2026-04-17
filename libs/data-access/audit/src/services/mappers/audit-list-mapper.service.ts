import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import { COLUMN_DELIMITER } from '@customer-portal/shared/constants';
import {
  convertToUtcDate,
  utcDateToPayloadFormat,
} from '@customer-portal/shared/helpers/date';
import { mapFilterConfigToValues } from '@customer-portal/shared/helpers/grid';
import { FilteringConfig } from '@customer-portal/shared/models/grid';

import {
  AuditExcelPayloadDto,
  AuditListDto,
  AuditListItemDto,
} from '../../dtos';
import { AuditListItemModel } from '../../models';

export class AuditListMapperService {
  static mapToAuditItemModel(
    dto: AuditListDto,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): AuditListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    const serviceMap = new Map(
      serviceMasterList.map((s) => [s.id, s.serviceName]),
    );
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    const result = data.map((audit: AuditListItemDto) => {
      const services = Array.from(
        new Set(
          (audit.services || [])
            .map((serviceId) => serviceMap.get(serviceId))
            .filter(Boolean),
        ),
      ).join(COLUMN_DELIMITER);

      const matchedSites = (audit.sites || [])
        .map((siteId) => siteMap.get(siteId))
        .filter(Boolean);

      const siteNames = Array.from(
        new Set(matchedSites.map((site) => site?.siteName).filter(Boolean)),
      ).join(COLUMN_DELIMITER);

      const cities = Array.from(
        new Set(matchedSites.map((site) => site?.city).filter(Boolean)),
      ).join(COLUMN_DELIMITER);

      const countries = Array.from(
        new Set(matchedSites.map((site) => site?.countryName).filter(Boolean)),
      ).join(COLUMN_DELIMITER);

      const companySite = companyMap.get(audit.companyId);
      const companyName = companySite?.companyName ?? '';

      return {
        auditNumber: String(audit.auditId),
        startDate: convertToUtcDate(audit.startDate),
        endDate: convertToUtcDate(audit.endDate),
        city: cities,
        country: countries,
        service: services,
        companyName,
        site: siteNames,
        leadAuthor: audit.leadAuditor,
        status: audit.status,
        type: audit.type,
      };
    });

    return result;
  }

  static mapToAuditExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): AuditExcelPayloadDto {
    return {
      filters: {
        auditId: mapFilterConfigToValues(
          filterConfig,
          'auditNumber',
          null,
          (value: string) => Number(value),
        ),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        country: mapFilterConfigToValues(filterConfig, 'country'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        leadAuditor: mapFilterConfigToValues(filterConfig, 'leadAuthor'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        type: mapFilterConfigToValues(filterConfig, 'type'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        startDate: mapFilterConfigToValues(
          filterConfig,
          'startDate',
          null,
          utcDateToPayloadFormat,
        ),
        endDate: mapFilterConfigToValues(
          filterConfig,
          'endDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }
}
