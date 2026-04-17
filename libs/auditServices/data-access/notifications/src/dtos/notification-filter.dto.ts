export interface NotificationResponseFilterDto {
  data: NotificationFilterDto[];
  isSuccess: boolean;
}

export interface NotificationFilterDto {
  id: number;
  label: string;
}

export interface NotificationSitesFilterDto {
  data: NotificationSiteDto[];
  isSuccess: boolean;
}

export interface NotificationSiteDto {
  id: number;
  label: string;
  children: NotificationSiteDto[];
}
