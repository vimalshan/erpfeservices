import {
  COLUMN_DELIMITER,
  FilteringConfig,
  FilterMode,
  FilterOperator,
} from '@customer-portal/shared';

import { FindingListDto } from '../../dtos';
import { FindingListItemModel } from '../../models';

export const mapToFindingItemModelDTO: FindingListDto = {
  data: [
    {
      findingsId: '1',
      status: 'Open',
      title: 'Sample Finding',
      category: 'Security',
      companyName: 'mock company',
      services: ['Service1', 'Service2'],
      sites: ['Site1'],
      countries: ['France'],
      cities: ['City1'],
      openDate: '2023-01-01',
      closedDate: '2023-01-03',
      acceptedDate: '2023-01-04',
      findingNumber: '123',
    },
  ],
};

export const mapToFindingItemModelExpected: FindingListItemModel[] = [
  {
    findingNumber: '123',
    companyName: 'mock company',
    status: 'Open',
    title: 'Sample Finding',
    category: 'Security',
    services: `Service1${COLUMN_DELIMITER}Service2`,
    site: 'Site1',
    country: 'France',
    city: 'City1',
    openDate: '01-01-2023',
    closeDate: '03-01-2023',
    findingsId: '1',
    acceptedDate: '04-01-2023',
  },
];

export const mapToFindingItemModelEmptyServiceDTO: FindingListDto = {
  data: [
    {
      findingsId: '2',
      companyName: 'mock company',
      status: 'Closed',
      title: 'Another Finding',
      category: 'Compliance',
      services: [],
      sites: ['Site2'],
      countries: ['France'],
      cities: ['City2'],
      openDate: '2023-01-01',
      closedDate: '2023-01-03',
      acceptedDate: '2023-01-04',
      findingNumber: '123',
    },
  ],
};

export const mapToFindingItemModelEmptyServiceExpected: FindingListItemModel[] =
  [
    {
      findingNumber: '123',
      companyName: 'mock company',
      status: 'Closed',
      title: 'Another Finding',
      category: 'Compliance',
      services: '',
      site: 'Site2',
      country: 'France',
      city: 'City2',
      openDate: '01-01-2023',
      closeDate: '03-01-2023',
      acceptedDate: '04-01-2023',
      findingsId: '2',
    },
  ];

export const mapToFindingExcelPayloadDtoFilterConfig: FilteringConfig = {
  findingNumber: {
    value: [{ label: '123', value: '123' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  status: {
    value: [{ label: 'open', value: 'open' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  title: {
    value: [{ label: 'title', value: 'title' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  category: {
    value: [{ label: 'category', value: 'category' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  services: {
    value: [{ label: 'services', value: 'services' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  site: {
    value: [{ label: 'site', value: 'site' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  country: {
    value: [{ label: 'country', value: 'country' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  city: {
    value: [{ label: 'city', value: 'city' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  auditNumber: {
    value: [{ label: 'audit', value: 'audit' }],
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
  },
  openDate: {
    value: [{ label: '01-05-2024', value: '01-05-2024' }],
    matchMode: FilterMode.DateAfter,
    operator: FilterOperator.And,
  },
  closeDate: {
    value: [{ label: '01-05-2024', value: '01-05-2024' }],
    matchMode: FilterMode.DateAfter,
    operator: FilterOperator.And,
  },
  acceptedDate: {
    value: [{ label: '01-05-2024', value: '01-05-2024' }],
    matchMode: FilterMode.DateAfter,
    operator: FilterOperator.And,
  },
};

export const mapToFindingExcelPayloadDtoExpectedFilters = {
  filters: {
    findings: ['123'],
    status: ['open'],
    title: ['title'],
    category: ['category'],
    service: ['services'],
    site: ['site'],
    country: ['country'],
    city: ['city'],
    auditId: ['audit'],
    openDate: ['2024-05-01'],
    companyName: null,
    closedDate: ['2024-05-01'],
    acceptedDate: ['2024-05-01'],
    findingsId: null,
  },
};
