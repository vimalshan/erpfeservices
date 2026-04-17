import {
  CellType,
  ColumnDefinition,
  ColumnType,
} from '@customer-portal/shared';

export const SETTINGS_TABS_COMPANY_DETAILS_GRID_COLUMNS: ColumnDefinition[] = [
  {
    field: 'organizationName',
    displayName: 'settings.grid.header.organizationName',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.CustomTemplate,
    hidden: false,
    fixed: false,
    sticky: false,
  },
];
