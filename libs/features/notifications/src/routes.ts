import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { ContractsListState } from '@customer-portal/data-access/contracts';
import { InvoiceListState } from '@customer-portal/data-access/financials';
import { NotificationListState } from '@customer-portal/data-access/notifications/state';
import { ScheduleListState } from '@customer-portal/data-access/schedules';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const NOTIFICATIONS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/notifications/notifications.component').then(
        (m) => m.NotificationsComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Notifications',
    providers: [
      provideTranslocoScope({
        scope: 'notifications',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([
          NotificationListState,
          ContractsListState,
          InvoiceListState,
          ScheduleListState,
        ]),
      ),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './lib/components/notification-list/notification-list.component'
          ).then((m) => m.NotificationListComponent),
        title: 'Notification List',
        providers: [
          importProvidersFrom(NgxsModule.forFeature([NotificationListState])),
        ],
      },
    ],
  },
];
