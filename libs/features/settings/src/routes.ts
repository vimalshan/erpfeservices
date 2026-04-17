import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { allowDnvUserGuard } from '@customer-portal/data-access/settings/guards';
import { SettingsState } from '@customer-portal/data-access/settings/state/settings.state';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const SETTINGS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Settings',
    providers: [
      provideTranslocoScope({
        scope: 'settings',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([SettingsState])),
    ],
  },
  {
    path: 'admin-members',
    loadComponent: () =>
      import(
        './lib/components/co-browsing-company-select/co-browsing-company-select.component'
      ).then((m) => m.CoBrowsingMembersSelectComponent),
    data: {
      breadcrumb: null,
    },
    canActivate: [allowDnvUserGuard],
    title: 'Admin Co-browsing Members',
    providers: [
      provideTranslocoScope({
        scope: 'settings',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([SettingsState])),
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import(
        './lib/components/co-browsing-members-select/co-browsing-members-select.component'
      ).then((m) => m.CoBrowsingCompanySelectComponent),
    data: {
      breadcrumb: null,
    },
    canActivate: [allowDnvUserGuard],
    title: 'Admin Co-browsing View',
    providers: [
      provideTranslocoScope({
        scope: 'settings',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([SettingsState])),
    ],
  },
];
