export interface UnreadActionsDto {
  actionsCount: UnreadActionsCountDto;
}

export interface UnreadActionsCountDto {
  data: number;
  isSuccess: boolean;
  message: string;
  errorCode: string;
}
