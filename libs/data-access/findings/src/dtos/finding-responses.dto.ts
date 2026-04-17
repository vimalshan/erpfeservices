export interface FindingResponsesDto {
  isSuccess: boolean;
  data: {
    rootCause: string;
    correctiveAction: string;
    correction: string;
    isSubmitToDnv: boolean;
    respondId: number;
    isDraft: boolean;
    updatedOn: string;
  } | null;
}
