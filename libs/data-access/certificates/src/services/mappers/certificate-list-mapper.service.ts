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
  CertificateExcelPayloadDto,
  CertificateListDto,
  CertificateListItemDto,
} from '../../dtos';
import { CertificateListItemModel } from '../../models';

export class CertificateListMapperService {
  static mapToCertificateListItemModel(
    dto: CertificateListDto,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): CertificateListItemModel[] {
    if (!dto.data) {
      return [];
    }

    const { data } = dto;

    const serviceMap = new Map(
      serviceMasterList.map((s) => [s.id, s.serviceName]),
    );
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));

    const result = data.map((certificateItem: CertificateListItemDto) => {
      const service = Array.from(
        new Set(
          (certificateItem.serviceIds || [])
            .map((serviceId) => serviceMap.get(serviceId))
            .filter(Boolean),
        ),
      ).join(COLUMN_DELIMITER);

      const matchedSites = (certificateItem.siteIds || [])
        .map((siteId) => siteMap.get(siteId))
        .filter(Boolean);

      const companyName =
        companyMap.get(certificateItem.companyId)?.companyName ?? '';

      const city = Array.from(
        new Set(matchedSites?.map((site) => site?.city)?.filter(Boolean)),
      )?.join(COLUMN_DELIMITER);
      const site = Array.from(
        new Set(matchedSites?.map((s) => s?.siteName)?.filter(Boolean)),
      )?.join(COLUMN_DELIMITER);

      return {
        certificateId: String(certificateItem.certificateId),
        city,
        service,
        status: certificateItem.status,
        certificateNumber: certificateItem.certificateNumber,
        companyName,
        site,
        validUntil: convertToUtcDate(certificateItem.validUntil),
        issuedDate: convertToUtcDate(certificateItem.issuedDate),
        revisionNumber: certificateItem.revisionNumber,
      } as CertificateListItemModel;
    });

    return result;
  }

  static mapToCertificateExcelPayloadDto(
    filterConfig: FilteringConfig,
  ): CertificateExcelPayloadDto {
    return {
      filters: {
        certificateNumber: mapFilterConfigToValues(
          filterConfig,
          'certificateNumber',
        ),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        status: mapFilterConfigToValues(filterConfig, 'status'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        validUntil: mapFilterConfigToValues(
          filterConfig,
          'validUntil',
          null,
          utcDateToPayloadFormat,
        ),
        issuedDate: mapFilterConfigToValues(
          filterConfig,
          'issuedDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }
}
