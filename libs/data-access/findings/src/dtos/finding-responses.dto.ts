export interface FindingResponsesDto {
  isSuccess: boolean;
  data: {
    rootCause: string;
    correctiveAction: string;
    correction: string;
    isSubmitToSuaadhya: boolean;
    respondId: number;
    isDraft: boolean;
    updatedOn: string;
  } | null;
}
