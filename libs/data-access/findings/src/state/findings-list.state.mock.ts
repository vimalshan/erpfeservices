import {
  FilteringConfig,
  FilterMode,
  FilterOperator,
  FilterValue,
  GridConfig,
  SortingMode,
} from '@customer-portal/shared';

import { FindingExcelPayloadDto, FindingListDto } from '../dtos';

export const mockedFindingsListResponse: FindingListDto = {
  data: [
    {
      findingsId: '234',
      companyName: 'mock company',
      status: 'Open',
      title: 'The organization shall have documented processes',
      category: 'CAT1 (major)',
      services: ['IFS Food version 8 April 2023', 'FSC-STD-40-004 V3-1'],
      sites: ['DNV GL GSS IT'],
      findingNumber: 'MANMES-0031',
      countries: ['France'],
      cities: ['Arnhem'],
      openDate: '2024-05-18',
      closedDate: '2024-05-18',
      acceptedDate: '2024-05-18',
    },
    {
      findingsId: '123',
      companyName: 'company name',
      status: 'Open',
      title: 'The organization shall have documented processes',
      category: 'CAT2 (Minor)',
      services: [
        'ISO 45001:2018',
        'ISO 45001:2018 || ISO 9001:2015',
        'FSC-STD-40-004 V3-1',
      ],
      sites: ['DNV GL GSS IT (Arnhem)'],
      countries: ['France'],
      cities: ['Arnhem'],
      findingNumber: 'MANMES-0032',
      openDate: '2024-05-15',
      closedDate: '2024-05-19',
      acceptedDate: '2024-05-10',
    },
  ],
};

export const expectedFindingsInState = [
  {
    findingNumber: 'MANMES-0031',
    findingsId: '234',
    status: 'Open',
    title: 'The organization shall have documented processes',
    category: 'CAT1 (major)',
    services: 'IFS Food version 8 April 2023 || FSC-STD-40-004 V3-1',
    site: 'DNV GL GSS IT',
    country: 'France',
    city: 'Arnhem',
    openDate: '18-05-2024',
    companyName: 'mock company',
    closeDate: '18-05-2024',
    acceptedDate: '18-05-2024',
  },
  {
    findingNumber: 'MANMES-0032',
    findingsId: '123',
    status: 'Open',
    title: 'The organization shall have documented processes',
    category: 'CAT2 (Minor)',
    services:
      'ISO 45001:2018 || ISO 45001:2018 || ISO 9001:2015 || FSC-STD-40-004 V3-1',
    site: 'DNV GL GSS IT (Arnhem)',
    country: 'France',
    city: 'Arnhem',
    openDate: '15-05-2024',
    companyName: 'company name',
    closeDate: '19-05-2024',
    acceptedDate: '10-05-2024',
  },
];

export const expectedFilterOptions = {
  findingNumber: [
    {
      label: 'MANMES-0031',
      value: 'MANMES-0031',
    },
    {
      label: 'MANMES-0032',
      value: 'MANMES-0032',
    },
  ],
  findingsId: [
    {
      label: '234',
      value: '234',
    },
    {
      label: '123',
      value: '123',
    },
  ],
  companyName: [
    {
      label: 'mock company',
      value: 'mock company',
    },
    {
      label: 'company name',
      value: 'company name',
    },
  ],
  status: [
    {
      label: 'Open',
      value: 'Open',
    },
  ],
  title: [
    {
      label: 'The organization shall have documented processes',
      value: 'The organization shall have documented processes',
    },
  ],
  category: [
    {
      label: 'CAT1 (major)',
      value: 'CAT1 (major)',
    },
    {
      label: 'CAT2 (Minor)',
      value: 'CAT2 (Minor)',
    },
  ],
  services: [
    {
      label: 'IFS Food version 8 April 2023',
      value: 'IFS Food version 8 April 2023',
    },

    { label: 'FSC-STD-40-004 V3-1', value: 'FSC-STD-40-004 V3-1' },

    { label: 'ISO 45001:2018', value: 'ISO 45001:2018' },

    { label: 'ISO 9001:2015', value: 'ISO 9001:2015' },
  ],
  site: [
    {
      label: 'DNV GL GSS IT',
      value: 'DNV GL GSS IT',
    },
    {
      label: 'DNV GL GSS IT (Arnhem)',
      value: 'DNV GL GSS IT (Arnhem)',
    },
  ],
  country: [
    {
      label: 'France',
      value: 'France',
    },
  ],
  city: [
    {
      label: 'Arnhem',
      value: 'Arnhem',
    },
  ],
  openDate: [
    {
      label: '18-05-2024',
      value: '18-05-2024',
    },
    {
      label: '15-05-2024',
      value: '15-05-2024',
    },
  ],
};

export const gridConfig: GridConfig = {
  filtering: {
    findingNumber: {
      matchMode: FilterMode.In,
      operator: FilterOperator.And,
      value: [
        {
          label: 'MANMES-0031',
          value: 'MANMES-0031',
        },
      ],
    },
  },
  sorting: { mode: SortingMode.Multiple, rules: [] },
  pagination: {
    paginationEnabled: true,
    pageSize: 10,
    startIndex: 0,
  },
};

export const userFilters: FilteringConfig = {
  findingNumber: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'MANMES-0031',
        value: 'MANMES-0031',
      },
      {
        label: 'MANMES-0035',
        value: 'MANMES-0035',
      },
      {
        label: 'MANMES-0047',
        value: 'MANMES-0047',
      },
    ],
  },
  findingsId: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: '1',
        value: '1',
      },
    ],
  },
  status: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'OPEN',
        value: 'OPEN',
      },
      {
        label: 'ACCEPTED',
        value: 'ACCEPTED',
      },
    ],
  },
  title: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'The organization shall have documented processes',
        value: 'The organization shall have documented processes',
      },
    ],
  },
  category: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'CAT1 - Major',
        value: 'CAT1 - Major',
      },
      {
        label: 'CAT2 - Minor',
        value: 'CAT2 - Minor',
      },
    ],
  },
  services: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'ISO 45001:2018',
        value: 'ISO 45001:2018',
      },
    ],
  },
  site: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'DNV GL GSS IT',
        value: 'DNV GL GSS IT',
      },
      {
        label: 'calenberger Strasse 36',
        value: 'calenberger Strasse 36',
      },
    ],
  },
  country: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'France',
        value: 'France',
      },
    ],
  },
  city: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: 'Arnhem',
        value: 'Arnhem',
      },
      {
        label: 'Nordstemmen',
        value: 'Nordstemmen',
      },
    ],
  },
  auditNumber: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [
      {
        label: '3067121',
        value: '3067121',
      },
      {
        label: '3067486',
        value: '3067486',
      },
    ],
  },
  openDate: {
    matchMode: FilterMode.DateBefore,
    operator: FilterOperator.And,
    value: [
      {
        label: '01-05-2024',
        value: '01-05-2024',
      },
      {
        label: '09-05-2024',
        value: '09-05-2024',
      },
    ],
  },

  closeDate: {
    matchMode: FilterMode.DateBefore,
    operator: FilterOperator.And,
    value: [
      {
        label: '02-05-2024',
        value: '02-05-2024',
      },
      {
        label: '15-05-2024',
        value: '15-05-2024',
      },
    ],
  },
  acceptedDate: {
    matchMode: FilterMode.DateBefore,
    operator: FilterOperator.And,
    value: [
      {
        label: '01-05-2024',
        value: '01-05-2024',
      },
      {
        label: '08-05-2024',
        value: '08-05-2024',
      },
    ],
  },
};

export const expectedRequestDownloadFindingsPayload: FindingExcelPayloadDto = {
  filters: {
    findings: ['MANMES-0031', 'MANMES-0035', 'MANMES-0047'],
    findingsId: ['1'],
    status: ['OPEN', 'ACCEPTED'],
    companyName: null,
    title: ['The organization shall have documented processes'],
    category: ['CAT1 - Major', 'CAT2 - Minor'],
    service: ['ISO 45001:2018'],
    site: ['DNV GL GSS IT', 'calenberger Strasse 36'],
    country: ['France'],
    city: ['Arnhem', 'Nordstemmen'],
    auditId: ['3067121', '3067486'],
    openDate: ['2024-05-01', '2024-05-09'],
    closedDate: ['2024-05-02', '2024-05-15'],
    acceptedDate: ['2024-05-01', '2024-05-08'],
  },
};

export const defaultFindingListState = {
  findingsList: {
    findingsItems: [
      {
        findingNumber: 'MANMES-0031',
        status: 'Open',
        title: 'The organization shall have documented processes',
        category: 'CAT1 (major)',
        services: 'IFS Food version 8 April 2023 || FSC-STD-40-004 V3-1',
        site: 'DNV GL GSS IT',
        country: 'France',
        city: 'Arnhem',
        auditNumber: '3067486',
        openDate: '18-05-2024',
        closeDate: '18-05-2024',
        acceptedDate: '18-05-2024',
      },
      {
        findingNumber: 'MANMES-0032',
        status: 'Open',
        title: 'The organization shall have documented processes',
        category: 'CAT2 (Minor)',
        services:
          'ISO 45001:2018 || ISO 45001:2018 || ISO 9001:2015 || FSC-STD-40-004 V3-1',
        site: 'DNV GL GSS IT (Arnhem)',
        country: 'France',
        city: 'Arnhem',
        auditNumber: '3067486',
        openDate: '15-05-2024',
        closeDate: '19-05-2024',
        acceptedDate: '10-05-2024',
      },
    ],
    gridConfig: {
      filtering: {
        findingNumber: {
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
          value: [
            {
              label: 'MANMES-0031',
              value: 'MANMES-0031',
            },
          ],
        },
      },
      sorting: { mode: SortingMode.Multiple, rules: [] },
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
    },
    filterOptions: {
      findingNumber: [
        {
          label: 'MANMES-0031',
          value: 'MANMES-0031',
        },
        {
          label: 'MANMES-0032',
          value: 'MANMES-0032',
        },
      ],
      status: [
        {
          label: 'Open',
          value: 'Open',
        },
      ],
      title: [
        {
          label: 'The organization shall have documented processes',
          value: 'The organization shall have documented processes',
        },
      ],
      category: [
        {
          label: 'CAT1 (major)',
          value: 'CAT1 (major)',
        },
        {
          label: 'CAT2 (Minor)',
          value: 'CAT2 (Minor)',
        },
      ],
      services: [
        {
          label: 'IFS Food version 8 April 2023',
          value: 'IFS Food version 8 April 2023',
        },

        { label: 'FSC-STD-40-004 V3-1', value: 'FSC-STD-40-004 V3-1' },

        { label: 'ISO 45001:2018', value: 'ISO 45001:2018' },

        { label: 'ISO 9001:2015', value: 'ISO 9001:2015' },
      ],
      site: [
        {
          label: 'DNV GL GSS IT',
          value: 'DNV GL GSS IT',
        },
        {
          label: 'DNV GL GSS IT (Arnhem)',
          value: 'DNV GL GSS IT (Arnhem)',
        },
      ],
      country: [
        {
          label: 'France',
          value: 'France',
        },
      ],
      city: [
        {
          label: 'Arnhem',
          value: 'Arnhem',
        },
      ],
      auditNumber: [
        {
          label: '3067486',
          value: '3067486',
        },
      ],
    },
  },
};

export const chartNavigationPayload: FilterValue[] = [
  {
    label: 'status',
    value: [
      {
        label: 'Open',
        value: 'Open',
      },
    ],
  },
  {
    label: 'openDate',
    value: [
      {
        label: '01-01-2024',
        value: '01-01-2024',
      },
      {
        label: '31-12-2024',
        value: '31-12-2024',
      },
    ],
  },
  {
    label: 'services',
    value: [],
  },
  {
    label: 'city',
    value: [],
  },
  {
    label: 'site',
    value: [],
  },
];
