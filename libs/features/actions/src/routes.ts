import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';


import { Language } from '@customer-portal/shared';
import { ActionsListState } from '@customer-portal/data-access/actions/state';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const ACTIONS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/actions/actions.component').then(
        (m) => m.ActionsComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Actions Overview',
    providers: [
      provideTranslocoScope({
        scope: 'actions',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([ActionsListState])),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./lib/components/actions-list/actions-list.component').then(
            (m) => m.ActionsListComponent,
          ),
        title: 'Actions List',
        providers: [
          importProvidersFrom(NgxsModule.forFeature([ActionsListState])),
        ],
      },
    ],
  },
];
