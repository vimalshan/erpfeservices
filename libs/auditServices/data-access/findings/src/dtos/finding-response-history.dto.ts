export interface FindingResponseHistoryDto {
  data: FindingResponseItemDto[];
}

export interface FindingResponseItemDto {
  auditorComments: AuditorCommentDto[];
  previousResponse: PreviousResponseDto;
}

export interface AuditorCommentDto {
  commentsInPrimaryLanguage: string;
  commentsInSecondaryLanguage: string;
  responseCommentId: number;
  updatedBy: string;
  updatedOn: string;
}

export interface PreviousResponseDto {
  correctionInPrimaryLanguage: string;
  correctionInSecondaryLanguage: string;
  correctiveActionInPrimaryLanguage: string;
  correctiveActionInSecondaryLanguage: string;
  responseId: number;
  rootCauseInPrimaryLanguage: string;
  rootCauseInSecondaryLanguage: string;
  updatedBy: string;
  updatedOn: string;
}
