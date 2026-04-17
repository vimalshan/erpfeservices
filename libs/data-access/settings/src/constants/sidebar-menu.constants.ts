import { environment } from '@customer-portal/environments';

import { SidebarGroup } from '../models';

export const SIDEBAR_MENU_GROUP_LIST: SidebarGroup[] = [
  {
    id: 'group1',
    items: [
      {
        i18nKey: 'overview',
        icon: 'home',
        id: 'id-overview',
        isDisabled: false,
        url: '/overview',
      },
    ],
  },
  {
    id: 'group2',
    items: [
      {
        i18nKey: 'contracts',
        icon: 'custom-file-check',
        id: 'id-contracts',
        isDisabled: false,
        url: '/contracts',
      },
      {
        i18nKey: 'schedule',
        icon: 'calendar',
        id: 'id-schedule',
        isDisabled: false,
        url: '/schedule',
      },
      {
        i18nKey: 'audits',
        icon: 'custom-clipboard-edit',
        id: 'id-audits',
        isDisabled: false,
        url: '/audits',
      },
      {
        i18nKey: 'findings',
        icon: 'custom-clipboard-results',
        id: 'id-findings',
        isDisabled: false,
        url: '/findings',
      },
      {
        i18nKey: 'financials',
        icon: 'money-bill',
        id: 'id-financials',
        isDisabled: false,
        url: '/financials',
      },
      {
        i18nKey: 'certificates',
        icon: 'custom-certified',
        id: 'id-certificates',
        isDisabled: false,
        url: '/certificates',
      },
    ],
  },
  {
    id: 'group3',
    items: [
      {
        i18nKey: 'trainings',
        icon: 'graduation-cap',
        id: 'id-trainings',
        isDisabled: false,
        url: '/trainings',
        externalUrl: environment.lmsUrl,
      },
      {
        i18nKey: 'apps',
        icon: 'th-large',
        id: 'id-apps',
        isDisabled: false,
        url: '/apps',
      },
    ],
  },
];
