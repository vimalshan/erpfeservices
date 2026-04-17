import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { UnreadActionsStoreService } from '@customer-portal/data-access/actions/state';
import { DocumentsState } from '@customer-portal/data-access/documents/state/documents.state';
import {
  ConfirmScheduleDetailsState,
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionState,
  ScheduleCalendarActionStoreService,
  ScheduleListCalendarState,
  ScheduleListCalendarStoreService,
  ScheduleListState,
  ScheduleListStoreService,
} from '@customer-portal/data-access/schedules';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const SCHEDULES_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/schedule/schedule.component').then(
        (m) => m.ScheduleComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Schedule',
    providers: [
      UnreadActionsStoreService,
      ScheduleListCalendarStoreService,
      OverviewSharedStoreService,
      ConfirmScheduleDetailsStoreService,
      ScheduleCalendarActionStoreService,
      ScheduleListStoreService,
      provideTranslocoScope({
        scope: 'schedules',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([ScheduleListState, DocumentsState]),
      ),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './lib/components/schedule-list-calendar/schedule-list-calendar.component'
          ).then((m) => m.ScheduleListCalendarComponent),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([
              ScheduleListCalendarState,
              ConfirmScheduleDetailsState,
              ScheduleCalendarActionState,
            ]),
          ),
        ],
        title: 'Calendar View',
        data: {
          breadcrumb: null,
        },
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./lib/components/schedule-list/schedule-list.component').then(
            (m) => m.ScheduleListComponent,
          ),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([
              ConfirmScheduleDetailsState,
              ScheduleCalendarActionState,
            ]),
          ),
        ],
        title: 'Schedule List',
        data: {
          breadcrumb: {
            i18nKey: 'breadcrumb.lists',
            isHidden: true,
          },
        },
      },
    ],
  },
];
