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
  FindingExcelPayloadDto,
  FindingListDto,
  FindingListItemDto,
} from '../../dtos';
import { FindingListItemModel } from '../../models';

export class FindingsListMapperService {
  static mapToFindingItemModel(
    dto: FindingListDto,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): FindingListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    const serviceMap = new Map(
      serviceMasterList.map((s) => [s.id, s.serviceName]),
    );
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    const result = data.map((finding: FindingListItemDto) => {
      const services = (finding.services || [])
        .map((serviceId) => serviceMap.get(serviceId))
        .filter(Boolean)
        .join(COLUMN_DELIMITER);

      const siteInfo = siteMap.get(finding.siteId);

      const companySite = companyMap.get(finding.companyId);
      const companyName = companySite?.companyName ?? '';

      return {
        findingNumber: finding.findingNumber,
        status: finding.status,
        title: finding.title,
        category: finding.category,
        companyName,
        services,
        site: siteInfo?.siteName ?? '',
        city: siteInfo?.city ?? '',
        findingsId: String(finding.findingsId),
        openDate: convertToUtcDate(finding.openDate),
        closeDate: convertToUtcDate(finding.closedDate),
        acceptedDate: convertToUtcDate(finding.acceptedDate),
        response: finding.response,
        country: siteInfo?.countryName ?? '',
      };
    });

    return result;
  }

  static mapToFindingExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): FindingExcelPayloadDto {
    return {
      filters: {
        findings: mapFilterConfigToValues(filterConfig, 'findingNumber'),
        findingsId: mapFilterConfigToValues(filterConfig, 'findingsId'),
        response: mapFilterConfigToValues(filterConfig, 'response'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        title: mapFilterConfigToValues(filterConfig, 'title'),
        category: mapFilterConfigToValues(filterConfig, 'category'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        service: mapFilterConfigToValues(filterConfig, 'services'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        country: mapFilterConfigToValues(filterConfig, 'country'),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        auditId: mapFilterConfigToValues(filterConfig, 'auditNumber'),
        openDate: mapFilterConfigToValues(
          filterConfig,
          'openDate',
          null,
          utcDateToPayloadFormat,
        ),
        closedDate: mapFilterConfigToValues(
          filterConfig,
          'closeDate',
          null,
          utcDateToPayloadFormat,
        ),
        acceptedDate: mapFilterConfigToValues(
          filterConfig,
          'acceptedDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }
}
