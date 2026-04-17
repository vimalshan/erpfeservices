import { formatDateToGivenZoneAndFormat } from '@customer-portal/shared/helpers/date';

import {
  AuditorCommentDto,
  FindingResponseHistoryDto,
  FindingResponseItemDto,
} from '../../dtos';
import { AUDITOR_USERNAME_PREFIX } from '../../helpers';
import {
  AuditorResponseModel,
  FindingHistoryResponseModel,
  UserResponseModel,
} from '../../models/finding-history-response.model';

export class FindingResponseHistoryMapperService {
  static mapToFindingResponseHistoryModel(
    dto: FindingResponseHistoryDto,
  ): FindingHistoryResponseModel[] {
    if (!dto?.data) {
      return [];
    }

    const dateFormat = 'dd.MM.yyyy HH:mm';
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return dto.data.flatMap((findingResponse: FindingResponseItemDto) => {
      const responses: FindingHistoryResponseModel[] = [];

      const { previousResponse } = findingResponse;

      if (previousResponse) {
        const userModel: UserResponseModel = {
          userName: previousResponse.updatedBy,
          isAuditor: false,
          responseDateTime: formatDateToGivenZoneAndFormat(
            previousResponse.updatedOn,
            localZone,
            dateFormat,
          ),
          rootCause: previousResponse.rootCauseInPrimaryLanguage ?? '',
          correctiveAction:
            previousResponse.correctiveActionInPrimaryLanguage ?? '',
          correction: previousResponse.correctionInPrimaryLanguage ?? '',
        };
        responses.push(userModel);
      }

      findingResponse.auditorComments.forEach(
        (auditorComment: AuditorCommentDto) => {
          const auditorModel: AuditorResponseModel = {
            userName: `${AUDITOR_USERNAME_PREFIX} | ${auditorComment.updatedBy}`,
            isAuditor: true,
            responseDateTime: formatDateToGivenZoneAndFormat(
              auditorComment.updatedOn,
              localZone,
              dateFormat,
            ),
            auditorComment: auditorComment.commentsInPrimaryLanguage ?? '',
          };
          responses.push(auditorModel);
        },
      );

      return responses;
    });
  }
}
