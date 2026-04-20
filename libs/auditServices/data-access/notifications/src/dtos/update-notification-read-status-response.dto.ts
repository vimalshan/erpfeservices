export interface UpdateNotificationReadStatusResponse {
  data: MarkNotificationReadData;
}

export interface MarkNotificationReadData {
  markNotificationRead: MarkNotificationReadResult;
}

export interface MarkNotificationReadResult {
  id: number;
  title: string;
  isRead: boolean;
  readDate: string;
}
