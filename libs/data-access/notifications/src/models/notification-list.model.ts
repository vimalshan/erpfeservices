import { GridRowAction } from '@erp-services/shared';

export interface NotificationListModel {
  notifications: NotificationModel[];
}
export interface NotificationModel extends GridRowAction {
  entityId: string;
  snowLink: string;
}
