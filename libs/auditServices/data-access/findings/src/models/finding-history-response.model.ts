interface BaseResponseModel {
  userName: string;
  isAuditor: boolean;
  responseDateTime: string;
}

export interface AuditorResponseModel extends BaseResponseModel {
  isAuditor: true;
  auditorComment: string;
}

export interface UserResponseModel extends BaseResponseModel {
  isAuditor: false;
  rootCause: string;
  correctiveAction: string;
  correction: string;
}

export type FindingHistoryResponseModel =
  | AuditorResponseModel
  | UserResponseModel;
