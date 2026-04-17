export interface NotificationFilterModel {
  label: string;
  value: number;
}
export interface NotificationFilterDataModel {
  data: NotificationFilterModel[];
}
export interface NotificationSitesFilterModel {
  data: NotificationSiteModel[];
}
export interface NotificationSiteModel {
  label: string;
  value: number;
  children: NotificationSiteModel[];
}
