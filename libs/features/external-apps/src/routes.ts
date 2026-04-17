import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';

import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const EXTERNAL_APPS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/external-apps/external-apps.component').then(
        (m) => m.ExternalAppsComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'More Apps',
    providers: [
      provideTranslocoScope({
        scope: 'apps',
        loader,
      }),
    ],
  },
];
