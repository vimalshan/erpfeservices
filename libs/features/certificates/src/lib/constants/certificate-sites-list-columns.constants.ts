import {
  CellType,
  ColumnDefinition,
  ColumnType,
} from '@customer-portal/shared';

export const CERTIFICATES_SITES_LIST_COLUMNS: ColumnDefinition[] = [
  {
    field: 'siteName',
    displayName: 'certificate.certificateDetails.sites.siteName',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.TextWithIcon,
    hidden: false,
    fixed: false,
    sticky: false,
    width: '15%',
  },
  {
    field: 'siteAddress',
    displayName: 'certificate.certificateDetails.sites.siteAddress',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'siteScope',
    displayName: 'certificate.certificateDetails.sites.siteScope',
    type: ColumnType.CheckboxFilter,
    cellType: CellType.FullText,
    hidden: false,
    fixed: false,
    sticky: false,
  },
];
