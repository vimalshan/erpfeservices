export interface NotificationResponseFilterDto {
  data: NotificationFilterDto[];
}

export interface NotificationFilterDto {
  id: number;
  name: string;
}

export interface NotificationSitesFilterDto {
  data: NotificationSiteDto[];
}

export interface NotificationSiteDto {
  id: number;
  name: string;
}
