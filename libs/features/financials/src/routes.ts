import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import { DocumentsState } from '@customer-portal/data-access/documents/state/documents.state';
import { InvoiceListState } from '@customer-portal/data-access/financials';
import { Language } from '@customer-portal/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const FINANCIALS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/invoice-list/invoice-list.component').then(
        (m) => m.InvoiceListComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Financials',
    providers: [
      provideTranslocoScope({
        scope: 'invoices',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([InvoiceListState, DocumentsState]),
      ),
    ],
  },
];
