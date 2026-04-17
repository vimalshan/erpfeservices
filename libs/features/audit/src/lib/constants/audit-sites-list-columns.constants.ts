import {
  CellType,
  ColumnDefinition,
  ColumnType,
} from '@customer-portal/shared';

export const AUDIT_SITES_LIST_COLUMNS: ColumnDefinition[] = [
  {
    field: 'siteName',
    displayName: 'audit.auditDetails.sites.siteName',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'siteAddress',
    displayName: 'audit.auditDetails.sites.addressLine',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'city',
    displayName: 'audit.auditDetails.sites.city',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'country',
    displayName: 'audit.auditDetails.sites.country',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'postcode',
    displayName: 'audit.auditDetails.sites.postcode',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
];
