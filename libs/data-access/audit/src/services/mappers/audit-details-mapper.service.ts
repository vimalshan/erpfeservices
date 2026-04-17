import {
  ServiceMasterListItemModel,
  SiteMasterListItemModel,
} from '@customer-portal/data-access/global';
import {
  COLUMN_DELIMITER,
  CURRENT_DATE_FORMAT,
} from '@customer-portal/shared/constants';
import {
  convertToUtcDate,
  utcDateToPayloadFormat,
} from '@customer-portal/shared/helpers/date';
import { mapFilterConfigToValues } from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  GridFileActionType,
} from '@customer-portal/shared/models/grid';

import {
  AuditDetailsDto,
  AuditDocumentListItemDto,
  AuditDocumentsListDto,
  AuditFindingListDto,
  AuditFindingListItemDto,
  AuditFindingsExcelPayloadDto,
  AuditSiteListItemDto,
  SitesListDto,
  SubAuditExcelPayloadDto,
  SubAuditListItemDto,
} from '../../dtos';
import { SubAuditListDto } from '../../dtos/sub-audit-list.dto';
import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../../models';

export const STRING_DELIMITER = ', ';

export class AuditDetailsMapperService {
  static mapToAuditFindingListItemModel(
    dto: AuditFindingListDto,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): AuditFindingListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    const serviceMap = new Map(
      serviceMasterList.map((s) => [s.id, s.serviceName]),
    );
    const companyMap = new Map(siteMasterList.map((s) => [s.companyId, s]));
    const siteMap = new Map(siteMasterList.map((s) => [s.id, s]));

    return data.map((finding: AuditFindingListItemDto) => {
      const companyName = companyMap.get(finding.companyId)?.companyName ?? '';
      const site = siteMap.get(finding.siteId);
      const services = Array.from(
        new Set(
          (finding.services || [])
            .map((serviceId) => serviceMap.get(serviceId))
            .filter(Boolean),
        ),
      ).join(COLUMN_DELIMITER);

      return {
        findingNumber: String(finding.findingNumber),
        status: finding.status,
        title: finding.title,
        category: finding.category,
        companyName,
        services,
        site: site?.siteName ?? '',
        city: site?.city ?? '',
        auditNumber: String(finding.auditId),
        openDate: convertToUtcDate(finding.openDate, CURRENT_DATE_FORMAT),
        closeDate: convertToUtcDate(finding.closedDate, CURRENT_DATE_FORMAT),
        acceptedDate: convertToUtcDate(
          finding.acceptedDate,
          CURRENT_DATE_FORMAT,
        ),
      };
    });
  }

  static mapToAuditFindingsExcelPayloadDto(
    filterConfig: FilteringConfig,
    auditId: string,
  ): AuditFindingsExcelPayloadDto {
    return {
      filters: {
        findings: mapFilterConfigToValues(filterConfig, 'findingNumber'),
        audit: mapFilterConfigToValues(filterConfig, 'auditNumber'),
        auditId: [Number(auditId)],
        status: mapFilterConfigToValues(filterConfig, 'status'),
        title: mapFilterConfigToValues(filterConfig, 'title'),
        category: mapFilterConfigToValues(filterConfig, 'category'),
        companyName: mapFilterConfigToValues(filterConfig, 'companyName'),
        service: mapFilterConfigToValues(filterConfig, 'service'),
        city: mapFilterConfigToValues(filterConfig, 'city'),
        site: mapFilterConfigToValues(filterConfig, 'site'),
        openDate: mapFilterConfigToValues(
          filterConfig,
          'openDate',
          null,
          utcDateToPayloadFormat,
        ),
        acceptedDate: mapFilterConfigToValues(
          filterConfig,
          'acceptedDate',
          null,
          utcDateToPayloadFormat,
        ),
        closeDate: mapFilterConfigToValues(
          filterConfig,
          'closeDate',
          null,
          utcDateToPayloadFormat,
        ),
      },
    };
  }

  static mapToSubAuditItemModel(
    dto: SubAuditListDto,
    siteMasterList: SiteMasterListItemModel[],
    serviceMasterList: ServiceMasterListItemModel[],
  ): SubAuditListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((audit: SubAuditListItemDto) => {
      const service = (audit.services || [])
        .map(
          (serviceId) =>
            serviceMasterList.find((s) => s.id === serviceId)?.serviceName,
        )
        .filter(Boolean)
        .join(COLUMN_DELIMITER);

      const matchedSites = (audit.sites || [])
        .map((siteId) => siteMasterList.find((s) => s.id === siteId))
        .filter(Boolean);

      const siteNames = Array.from(
        new Set(matchedSites.map((site) => site?.siteName).filter(Boolean)),
      ).join(COLUMN_DELIMITER);
      const cities = Array.from(
        new Set(matchedSites.map((site) => site?.city).filter(Boolean)),
      ).join(COLUMN_DELIMITER);

      const auditorTeam = Array.from(new Set(audit.auditorTeam)).join(
        COLUMN_DELIMITER,
      );

      return {
        auditNumber: String(audit.auditId),
        status: audit.status,
        service,
        site: siteNames,
        city: cities,
        startDate: convertToUtcDate(audit.startDate),
        endDate: convertToUtcDate(audit.endDate),
        auditorTeam,
      };
    });
  }

  static mapToSubAuditExcelPayloadDto(
    auditId: number,
    filterConfig: FilteringConfig,
  ): SubAuditExcelPayloadDto {
    return {
      auditId,
      filters: {
        status: mapFilterConfigToValues(filterConfig, 'status', []) as string[],
        service: mapFilterConfigToValues(
          filterConfig,
          'service',
          [],
        ) as string[],
        sites: mapFilterConfigToValues(filterConfig, 'site', []) as string[],
        city: mapFilterConfigToValues(filterConfig, 'city', []) as string[],
        startDate: mapFilterConfigToValues(
          filterConfig,
          'startDate',
          [],
          utcDateToPayloadFormat,
        ) as string[],
        endDate: mapFilterConfigToValues(
          filterConfig,
          'endDate',
          [],
          utcDateToPayloadFormat,
        ) as string[],
        auditorTeam: (
          mapFilterConfigToValues(filterConfig, 'auditorTeam', []) as string[]
        )
          .join()
          .split(STRING_DELIMITER)
          .filter((e) => e),
      },
    };
  }

  static mapToAuditDetailsModel(
    dto: AuditDetailsDto,
  ): AuditDetailsModel | null {
    if (!dto?.data) {
      return null;
    }

    const { data } = dto;

    const services = data.services
      .map((service) => service)
      .filter(
        (serviceName) => serviceName !== null && serviceName !== undefined,
      )
      .join(STRING_DELIMITER);

    const auditorTeam = data.auditorTeam
      .filter((memberName) => memberName !== null && memberName !== undefined)
      .map((member) => `${member}`);

    const resultModel: AuditDetailsModel = {
      auditNumber: Number(data.auditId),
      header: {
        status: data.status,
        siteName: data.siteName,
        siteAddress: data.siteAddress,
        startDate: convertToUtcDate(data.startDate, CURRENT_DATE_FORMAT),
        endDate: convertToUtcDate(data.endDate, CURRENT_DATE_FORMAT),
        auditor: data.leadAuditor,
        auditorTeam,
        services,
        auditPlanDocId: [] as number[],
        auditReportDocId: [] as number[],
      },
    };

    return resultModel;
  }

  static extractPlanAndReportDocIds(reports: AuditDocumentsListDto): {
    auditPlanDocId: number[];
    auditReportDocId: number[];
  } {
    const customerTypeSecurity = '10';

    return (
      reports?.data?.reduce(
        (acc, item) => {
          if (item.currentSecurity === customerTypeSecurity) {
            if (item.type?.toLowerCase().includes('audit plan')) {
              acc.auditPlanDocId.push(item.documentId);
            } else if (item.type?.toLowerCase().includes('audit report')) {
              acc.auditReportDocId.push(item.documentId);
            }
          }

          return acc;
        },
        {
          auditPlanDocId: [] as number[],
          auditReportDocId: [] as number[],
        },
      ) ?? {
        auditPlanDocId: [],
        auditReportDocId: [],
      }
    );
  }

  static mapToAuditSitesItemModel(dto: SitesListDto): AuditSiteListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((site: AuditSiteListItemDto) => ({
      siteName: site.siteName,
      siteAddress: site.addressLine,
      city: site.city,
      country: site.country,
      postcode: site.postCode,
    }));
  }

  static mapToAuditDocumentItemModel(
    dto: AuditDocumentsListDto,
    hasAuditsEditPermission: boolean,
    isDnvUser: boolean,
  ): AuditDocumentListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((auditDocument: AuditDocumentListItemDto) => {
      const actions = [
        {
          label: 'download',
          iconClass: 'pi-download',
          actionType: GridFileActionType.Download,
        },
      ];

      const canBeDeleted =
        !isDnvUser && auditDocument.canBeDeleted && hasAuditsEditPermission;

      if (canBeDeleted) {
        actions.push({
          label: 'delete',
          iconClass: 'pi-trash',
          actionType: GridFileActionType.Delete,
        });
      }

      return {
        documentId: auditDocument.documentId,
        fileName: auditDocument.fileName,
        fileType: auditDocument.type,
        dateAdded: convertToUtcDate(
          auditDocument.dateAdded,
          CURRENT_DATE_FORMAT,
        ),
        uploadedBy: auditDocument.uploadedBy,
        actions,
        canBeDeleted: auditDocument.canBeDeleted,
      };
    });
  }
}
