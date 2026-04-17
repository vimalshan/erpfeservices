import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import {
  OverviewFinancialStatusState,
  OverviewListState,
  OverviewUpcomingAuditsState,
  TrainingStatusState,
} from '@erp-services/data-access/overview';
import { Language } from '@erp-services/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const OVERVIEW_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/overview-list/overview-list.component').then(
        (m) => m.OverviewListComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Overview',
    providers: [
      provideTranslocoScope({
        scope: 'overview',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([
          OverviewListState,
          TrainingStatusState,
          OverviewFinancialStatusState,
          OverviewUpcomingAuditsState,
        ]),
      ),
    ],
  },
];
