import {
  CellType,
  ColumnDefinition,
  ColumnType,
} from '@customer-portal/shared';

export const NOTIFICATION_LIST_COLUMNS: ColumnDefinition[] = [
  {
    field: 'title',
    displayName: 'notifications.notificationList.title',
    type: ColumnType.Text,
    cellType: CellType.CustomTemplate,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'message',
    displayName: 'notifications.notificationList.message',
    type: ColumnType.Text,
    cellType: CellType.HtmlText,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'receivedOn',
    displayName: 'notifications.notificationList.receivedOn',
    type: ColumnType.Text,
    cellType: CellType.Date,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'actions',
    displayName: '',
    type: ColumnType.Actions,
    cellType: CellType.Actions,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'entityType',
    displayName: 'entityType',
    type: ColumnType.Text,
    cellType: CellType.Text,
    hidden: true,
    fixed: false,
    sticky: false,
  },
];
