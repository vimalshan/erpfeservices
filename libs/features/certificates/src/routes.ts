import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import {
  CertificateDetailsState,
  CertificateListGraphState,
  CertificateListState,
} from '@erp-services/data-access/certificates';
import { DocumentsState } from '@erp-services/data-access/documents/state/documents.state';
import { Language } from '@erp-services/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const CERTIFICATES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/certificate/certificate.component').then(
        (m) => m.CertificateComponent,
      ),
    providers: [
      provideTranslocoScope({
        scope: 'certificate',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([CertificateListState, DocumentsState]),
      ),
    ],
    title: 'Certificates Overview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './lib/components/certificate-list/certificate-list.component'
          ).then((m) => m.CertificateListComponent),
        title: 'Certificate List',
      },
      {
        path: 'listgraphs',
        loadComponent: () =>
          import(
            './lib/components/certificate-list-graph/certificate-list-graph.component'
          ).then((m) => m.CertificateListGraphComponent),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([CertificateListGraphState]),
          ),
        ],
        title: 'Certificate Graphs',
        data: {
          breadcrumb: {
            i18nKey: 'breadcrumb.graphs',
            isHidden: true,
          },
        },
        children: [
          {
            path: '',
            redirectTo: 'status',
            pathMatch: 'full',
          },
          {
            path: 'status',
            loadComponent: () =>
              import(
                './lib/components/certificate-list-graph/certificate-list-status'
              ).then((m) => m.CertificateListStatusGraphComponent),
            title: 'Certificate Status Graph',
          },
          {
            path: 'site',
            loadComponent: () =>
              import(
                './lib/components/certificate-list-graph/certificate-list-site'
              ).then((m) => m.CertificateListSiteGraphComponent),
            title: 'Certificate Site Graph',
          },
        ],
      },
    ],
  },
  {
    path: ':certificateId',
    loadComponent: () =>
      import(
        './lib/components/certificate-details/certificate-details.component'
      ).then((m) => m.CertificateDetailsComponent),
    providers: [
      provideTranslocoScope({
        scope: 'certificate',
        loader,
      }),
      importProvidersFrom(NgxsModule.forFeature([CertificateDetailsState])),
    ],
    title: 'Certificate Details',
    data: {
      breadcrumb: null,
    },
  },
];
