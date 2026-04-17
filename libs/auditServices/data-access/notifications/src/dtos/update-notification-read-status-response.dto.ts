export interface UpdateNotificationReadStatusResponse {
  data: UpdateNotificationReadStatus;
}

export interface UpdateNotificationReadStatus {
  updateNotificationReadStatus: UpdateNotificationReadStatusData;
}

export interface UpdateNotificationReadStatusData {
  data: UpdateNotificationReadStatusMessage;
  isSuccess: boolean;
  message: string;
  errorCode: string;
}

export interface UpdateNotificationReadStatusMessage {
  statusMessage: string;
  isSuccess: boolean;
}
