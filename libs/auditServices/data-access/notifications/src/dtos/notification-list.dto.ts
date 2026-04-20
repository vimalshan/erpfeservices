export interface NotificationListDto {
  data: NotificationsDto[];
  pageInfo: NotificationPageInfo;
}

export interface NotificationPageInfo {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface NotificationsDto {
  id: number;
  title: string;
  message: string;
  category: string;
  createdDate: string;
  isRead: boolean;
}
