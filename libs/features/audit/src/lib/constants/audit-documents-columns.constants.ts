import {
  CellType,
  ColumnDefinition,
  ColumnType,
} from '@customer-portal/shared';

export const AUDIT_DOCUMENTS_COLUMNS: ColumnDefinition[] = [
  {
    field: 'fileName',
    displayName: 'audit.attachedDocuments.fileName',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'fileType',
    displayName: 'audit.attachedDocuments.type',
    type: ColumnType.CheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'dateAdded',
    displayName: 'audit.attachedDocuments.dateAdded',
    type: ColumnType.DateFilter,
    cellType: CellType.Date,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'uploadedBy',
    displayName: 'audit.attachedDocuments.uploadedBy',
    type: ColumnType.CheckboxFilter,
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
