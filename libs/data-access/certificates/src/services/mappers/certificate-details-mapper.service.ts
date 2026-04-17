import { CURRENT_DATE_FORMAT } from '@customer-portal/shared/constants';
import { convertToUtcDate } from '@customer-portal/shared/helpers/date';
import { GridFileActionType } from '@customer-portal/shared/models/grid';

import {
  CertificateDetailsDto,
  CertificateSiteListItemDto,
  CertificateSitesListDto,
} from '../../dtos';
import {
  CertificateDocumentsListDto,
  CertificateDocumentsListItemDto,
} from '../../dtos/certificate-documents-list.dto';
import {
  CertificationMarksListDto,
  CertificationMarksListItemDto,
} from '../../dtos/certification-marks-list.dto';
import {
  CertificateDetailsModel,
  CertificateDetailsScope,
  CertificateDocumentsListItemModel,
  CertificateLanguage,
  CertificateSiteListItemModel,
  CertificationMarksListItemModel,
} from '../../models';

export const SERVICES_DELIMITER = ', ';

export class CertificateDetailsMapperService {
  static mapToCertificateSitesItemModel(
    dto: CertificateSitesListDto,
  ): CertificateSiteListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((site: CertificateSiteListItemDto) => ({
      siteName: site.siteNameInPrimaryLanguage,
      siteNameInPrimaryLanguage: site.siteNameInPrimaryLanguage,
      siteNameInSecondaryLanguage: site.siteNameInSecondaryLanguage,
      siteAddress: site.siteAddressInPrimaryLanguage,
      siteAddressInPrimaryLanguage: site.siteAddressInPrimaryLanguage,
      siteAddressInSecondaryLanguage: site.siteAddressInSecondaryLanguage,
      iconTooltip: {
        displayIcon: site.isPrimarySite,
        iconClass: 'pi pi-globe',
        tooltipMessage: 'Primary site',
        iconPosition: 'prefix',
      },
      siteScope: site.siteScopeInPrimaryLanguage,
      primaryLanguageSiteScope: site.siteScopeInPrimaryLanguage,
      secondaryLanguageSiteScope: site.siteScopeInSecondaryLanguage,
    }));
  }

  static mapToCertificateDocumentItemModel(
    dto: CertificateDocumentsListDto,
  ): CertificateDocumentsListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((certificateDocument: CertificateDocumentsListItemDto) => ({
      documentId: certificateDocument.documentId,
      fileName: certificateDocument.fileName,
      type: certificateDocument.type,
      dateAdded: convertToUtcDate(
        certificateDocument.dateAdded,
        CURRENT_DATE_FORMAT,
      ),
      uploadedBy: certificateDocument.uploadedBy,
      language: certificateDocument.language,
      canBeDeleted: certificateDocument.canBeDeleted,
      currentSecurity: certificateDocument.currentSecurity,
      contactEmail: certificateDocument.contactEmail,
      actions: [
        {
          label: 'download',
          iconClass: 'pi-download',
          url: '',
          actionType: GridFileActionType.Download,
        },
      ],
    }));
  }

  static mapToCertificateDetailsModel(
    dto: CertificateDetailsDto,
  ): CertificateDetailsModel | null {
    if (!dto?.data) {
      return null;
    }

    const { data } = dto;
    const {
      primaryLanguage,
      secondaryLanguage,
      scopeInPrimaryLanguage,
      scopeInAdditionalLanguages,
      scopeInSecondaryLanguage,
    } = data;

    const languages: CertificateLanguage[] = [
      {
        code: primaryLanguage?.toLowerCase(),
        name: primaryLanguage,
        isPrimaryLanguage: true,
        isSelected: true,
      },
      ...(secondaryLanguage
        ? [
            {
              code: secondaryLanguage.toLowerCase(),
              name: secondaryLanguage,
              isPrimaryLanguage: false,
              isSelected: false,
            },
          ]
        : []),
      ...scopeInAdditionalLanguages
        .filter((additional) => additional.language?.trim())
        .map((additional) => ({
          code: additional.language?.toLowerCase(),
          name: additional.language,
          isPrimaryLanguage: false,
          isSelected: false,
        })),
    ];

    const scopes: CertificateDetailsScope[] = [
      {
        language: primaryLanguage?.toLowerCase(),
        content: scopeInPrimaryLanguage,
      },
      {
        language: secondaryLanguage?.toLowerCase(),
        content: scopeInSecondaryLanguage,
      },
      ...scopeInAdditionalLanguages
        .filter((additional) => additional.language?.trim())
        .map((additional) => ({
          language: additional.language?.toLowerCase(),
          content: additional.scope,
        })),
    ];

    const resultModel: CertificateDetailsModel = {
      certificateId: data.certificateId,
      certificateNumber: data.certificateNumber,
      newCertificateId: data?.newCertificateId,
      accountDNVId: data?.accountDNVId,
      header: {
        creationDate: convertToUtcDate(data?.creationDate, CURRENT_DATE_FORMAT),
        documentMarks: data.documentMarks?.map((d) => ({
          service: d.service,
          documentMarkUrls: d.documentMarkUrls?.map((documentMarkUrl) => ({
            languageCode: documentMarkUrl.languageCode,
            url: documentMarkUrl.url,
          })),
        })),
        issuedDate: convertToUtcDate(data?.issuedDate, CURRENT_DATE_FORMAT),
        languages,
        newRevisionNumber: data.newRevisionNumber,
        revisionNumber: data.revisionNumber,
        scopes,
        services: data.services.join(SERVICES_DELIMITER),
        siteAddress: data.siteAddressInPrimaryLanguage,
        siteName: data.siteNameInPrimaryLanguage,
        status: data.status,
        suspendedDate: convertToUtcDate(
          data?.suspendedDate,
          CURRENT_DATE_FORMAT,
        ),
        validUntilDate: convertToUtcDate(
          data?.validUntilDate,
          CURRENT_DATE_FORMAT,
        ),
        withdrawnDate: convertToUtcDate(
          data?.withdrawnDate,
          CURRENT_DATE_FORMAT,
        ),
        qRCodeLink: data.qRCodeLink,
        projectNumber: data.projectNumber,
        reportingCountry: data.reportingCountry,
      },
    };

    return resultModel;
  }

  static mapToCertificationMarksModel(
    dto: CertificationMarksListDto,
  ): CertificationMarksListItemModel[] {
    if (!dto?.data) {
      return [];
    }

    const { data } = dto;

    return data.map((certificationMark: CertificationMarksListItemDto) => ({
      fileName: certificationMark.description,
      actions: [
        {
          label: 'download',
          iconClass: 'pi-download',
          url: certificationMark.link,
          actionType: GridFileActionType.Download,
        },
      ],
    }));
  }
}
