import { GridRowAction } from '@customer-portal/shared';

export interface NotificationListModel {
  notifications: NotificationModel[];
}
export interface NotificationModel extends GridRowAction {
  entityId: string;
  snowLink: string;
}
