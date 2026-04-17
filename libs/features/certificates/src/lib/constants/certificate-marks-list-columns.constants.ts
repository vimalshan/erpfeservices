import {
  CellType,
  ColumnDefinition,
  ColumnType,
} from '@customer-portal/shared';

export const CERTIFICATE_MARKS_LIST_COLUMNS: ColumnDefinition[] = [
  {
    field: 'fileName',
    displayName: 'certificate.attachedDocuments.fileName',
    type: ColumnType.Text,
    cellType: CellType.Text,
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
    sticky: true,
    hideFromColumnManagement: true,
  },
];
