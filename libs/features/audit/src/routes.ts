import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import {
  AuditDaysGridService,
  AuditDetailsState,
  AuditListGraphState,
  AuditListState,
} from '@customer-portal/data-access/audit';
import { DocumentsState } from '@customer-portal/data-access/documents/state/documents.state';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const AUDIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/audit/audit.component').then(
        (m) => m.AuditComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'audit',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([AuditListState, DocumentsState]),
      ),
    ],
    title: 'Audit Overview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./lib/components/audit-list/audit-list.component').then(
            (m) => m.AuditListComponent,
          ),
        title: 'Audit List',
      },
      {
        path: 'listgraphs',
        loadComponent: () =>
          import(
            './lib/components/audit-list-graph/audit-list-graph.component'
          ).then((m) => m.AuditListGraphComponent),
        providers: [
          AuditDaysGridService,
          importProvidersFrom(NgxsModule.forFeature([AuditListGraphState])),
        ],
        title: 'Audit List Graphs',
        data: {
          breadcrumb: {
            i18nKey: 'breadcrumb.graphs',
            isHidden: true,
          },
        },
        children: [
          {
            path: '',
            redirectTo: 'audit-status',
            pathMatch: 'full',
          },
          {
            path: 'audit-status',
            loadComponent: () =>
              import(
                './lib/components/audit-list-graph/audit-status/audit-list-status-graph.component'
              ).then((m) => m.AuditListStatusGraphComponent),
          },
          {
            path: 'audit-days',
            loadComponent: () =>
              import(
                './lib/components/audit-list-graph/audit-days/audit-list-days-graph.component'
              ).then((m) => m.AuditListDaysGraphComponent),
          },
        ],
      },
    ],
  },
  {
    path: ':auditId',
    loadComponent: () =>
      import('./lib/components/audit-details/audit-details.component').then(
        (m) => m.AuditDetailsComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'audit',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([AuditDetailsState])),
    ],
    title: 'Audit Details',
    data: {
      breadcrumb: null,
    },
  },
];
