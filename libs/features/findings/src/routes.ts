import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { UnreadActionsStoreService } from '@customer-portal/data-access/actions/state';
import { DocumentsState } from '@customer-portal/data-access/documents/state/documents.state';
import {
  FindingDetailsState,
  FindingListGraphState,
  FindingsListState,
} from '@customer-portal/data-access/findings';
import { Language } from '@customer-portal/shared';

import { findingDetailsDeactivationGuard } from './lib/guards';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const FINDINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/finding/finding.component').then(
        (m) => m.FindingComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'findings',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([FindingsListState, DocumentsState]),
      ),
    ],
    title: 'Findings Overview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./lib/components/finding-list/finding-list.component').then(
            (m) => m.FindingListComponent,
          ),
        title: 'Finding List',
      },
      {
        path: 'listgraphs',
        loadComponent: () =>
          import(
            './lib/components/finding-list-graph/finding-list-graph.component'
          ).then((m) => m.FindingListGraphComponent),
        providers: [
          importProvidersFrom(NgxsModule.forFeature([FindingListGraphState])),
        ],
        title: 'Finding Graphs',
        data: {
          breadcrumb: {
            i18nKey: 'breadcrumb.graphs',
            isHidden: true,
          },
        },
        children: [
          {
            path: '',
            redirectTo: 'finding-status',
            pathMatch: 'full',
          },
          {
            path: 'finding-status',
            loadComponent: () =>
              import(
                './lib/components/finding-list-graph/finding-status/finding-list-status.component'
              ).then((m) => m.FindingListStatusComponent),
          },
          {
            path: 'open-findings',
            loadComponent: () =>
              import(
                './lib/components/finding-list-graph/open-findings/open-findings-list.component'
              ).then((m) => m.OpenFindingsListComponent),
          },
          {
            path: 'findings-by-clause',
            loadComponent: () =>
              import(
                './lib/components/finding-list-graph/findings-by-clause/finding-list-by-clause.component'
              ).then((m) => m.FindingListByClauseComponent),
          },
          {
            path: 'findings-by-site',
            loadComponent: () =>
              import(
                './lib/components/finding-list-graph/findings-by-site/finding-list-by-site.component'
              ).then((m) => m.FindingListBySiteComponent),
          },
          {
            path: 'trends',
            loadComponent: () =>
              import(
                './lib/components/finding-list-graph/finding-trends-graph/finding-list-trends-graph.component'
              ).then((m) => m.FindingListTrendsGraphComponent),
          },
        ],
      },
    ],
  },
  {
    path: ':findingId',
    loadComponent: () =>
      import('./lib/components/finding-details/finding-details.component').then(
        (m) => m.FindingDetailsComponent,
      ),
    providers: [
      UnreadActionsStoreService,
      importProvidersFrom(NgxsModule.forFeature([FindingDetailsState])),
      provideTranslocoScope({
        scope: 'findings',
        loader,
      }),
    ],
    title: 'Finding Details',
    data: {
      breadcrumb: null,
    },
    canDeactivate: [findingDetailsDeactivationGuard],
  },
];
