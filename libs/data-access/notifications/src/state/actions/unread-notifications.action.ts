import { NotificationModel } from '../../models';

export class LoadUnreadNotifications {
  static readonly type = '[Unread Notification] Load Unread Notifications';

  constructor(public payload?: NotificationModel[]) {}
}
