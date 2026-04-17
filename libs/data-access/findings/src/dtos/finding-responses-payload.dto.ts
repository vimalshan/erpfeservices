export interface FindingResponsesPayloadDto {
  request: {
    responseId?: string | null;
    findingNumber: string;
    rootCause: string;
    correctiveAction: string;
    correction: string;
    isSubmitToDnv: boolean;
  };
}
