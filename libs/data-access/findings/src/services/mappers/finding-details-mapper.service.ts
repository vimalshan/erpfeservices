import { CURRENT_DATE_FORMAT } from '@customer-portal/shared/constants';
import { convertToUtcDate } from '@customer-portal/shared/helpers/date';

import {
  FindingDetailsDto,
  FindingResponsesDto,
  FindingResponsesPayloadDto,
  ManageFindingDetailsDto,
} from '../../dtos';
import { FindingDetailsModel, FindingResponsesModel } from '../../models';

export const SERVICES_DELIMITER = ', ';

export class FindingDetailsMapperService {
  static mapToFindingDetailsModel(
    findingDetailsDto: FindingDetailsDto,
    manageFindingDetailsDto: ManageFindingDetailsDto,
  ): FindingDetailsModel | null {
    if (!findingDetailsDto?.data || !manageFindingDetailsDto?.data) {
      return null;
    }

    const { data: findingDetailsData } = findingDetailsDto;
    const { data: manageFindingDetailsData } = manageFindingDetailsDto;
    const services = Array.isArray(findingDetailsData.services)
      ? Array.from(new Set(findingDetailsData.services)).join(
          SERVICES_DELIMITER,
        )
      : '';
    const { siteName = '', siteAddress = '' } =
      (Array.isArray(findingDetailsData.sites) &&
        findingDetailsData.sites[0]) ||
      {};
    const auditor = Array.isArray(findingDetailsData.auditors)
      ? findingDetailsData.auditors[0] || ''
      : '';
    const { category } = manageFindingDetailsData;
    const clause =
      (Array.isArray(manageFindingDetailsData.clauses) &&
        manageFindingDetailsData.clauses[0]) ||
      '';
    const {
      focusAreaInPrimaryLanguage = '',
      focusAreaInSecondaryLanguage = '',
    } =
      (Array.isArray(manageFindingDetailsData.focusAreas) &&
        manageFindingDetailsData.focusAreas[0]) ||
      {};

    const resultModel: FindingDetailsModel = {
      findingNumber: String(findingDetailsData.findingNumber),
      header: {
        auditNumber: String(findingDetailsData.auditId),
        site: siteName,
        city: siteAddress,
        openDate: convertToUtcDate(
          findingDetailsData.openedDate,
          CURRENT_DATE_FORMAT,
        ),
        dueDate: convertToUtcDate(
          findingDetailsData.dueDate,
          CURRENT_DATE_FORMAT,
        ),
        closeDate: convertToUtcDate(
          findingDetailsData.closedDate,
          CURRENT_DATE_FORMAT,
        ),
        acceptedDate: convertToUtcDate(
          findingDetailsData.acceptedDate,
          CURRENT_DATE_FORMAT,
        ),
        auditor,
        auditType: findingDetailsData.auditType,
        services,
        status: findingDetailsData.status,
      },
      primaryLanguageDescription: {
        category,
        description: manageFindingDetailsData.descriptionInPrimaryLanguage,
        clause,
        focusArea: focusAreaInPrimaryLanguage,
        language: manageFindingDetailsData.primaryLanguage,
        isPrimaryLanguage: true,
        isSelected: true,
        title: manageFindingDetailsData.titleInPrimaryLanguage,
      },
      secondaryLanguageDescription: {
        category,
        description: manageFindingDetailsData.descriptionInSecondaryLanguage,
        clause,
        focusArea: focusAreaInSecondaryLanguage,
        language: manageFindingDetailsData.secondaryLanguage,
        isPrimaryLanguage: false,
        isSelected: false,
        title: manageFindingDetailsData.titleInSecondaryLanguage,
      },
    };

    return resultModel;
  }

  static mapToFindingResponsesPayloadDto(
    submitModel: FindingResponsesModel,
    findingNumber: string,
    responseId?: string,
  ): FindingResponsesPayloadDto {
    return {
      request: {
        findingNumber,
        responseId: submitModel.isSubmit ? responseId : null,
        isSubmitToDnv: submitModel.isSubmit,
        rootCause: submitModel.formValue.rootCause,
        correctiveAction: submitModel.formValue.correctionAction,
        correction: submitModel.formValue.nonConformity,
      },
    };
  }

  static mapToFindingResponsesModel(
    dto: FindingResponsesDto,
  ): FindingResponsesModel | null {
    if (!dto?.data) {
      return null;
    }

    const { data } = dto;

    return {
      formValue: {
        correctionAction: data.correctiveAction,
        nonConformity: data.correction,
        rootCause: data.rootCause,
      },
      isSubmit: data.isSubmitToDnv,
      createdOn: convertToUtcDate(data.updatedOn, CURRENT_DATE_FORMAT),
      isDraft: data.isDraft,
      respondId: data.respondId ? String(data.respondId) : '',
    };
  }
}
