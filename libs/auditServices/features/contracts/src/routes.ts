import { importProvidersFrom } from '@angular/core';
import { InlineLoader, provideTranslocoScope } from '@jsverse/transloco';
import { NgxsModule } from '@ngxs/store';

import {
  CONTRACTS_LIST_SERVICE,
  ContractsListService,
  ContractsListState,
} from '@erp-services/data-access/contracts';
import { DocumentsState } from '@erp-services/data-access/documents/state/documents.state';
import { Language } from '@erp-services/shared';

export const loader = [Language.English, Language.Italian].reduce(
  (acc: InlineLoader, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {},
);

export const CONTRACTS_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./lib/components/contract-list/contract-list.component').then(
        (m) => m.ContractListComponent,
      ),
    data: {
      breadcrumb: null,
    },
    title: 'Contracts',
    providers: [
      provideTranslocoScope({
        scope: 'contracts',
        loader,
      }),
      importProvidersFrom(
        NgxsModule.forFeature([ContractsListState, DocumentsState]),
      ),
      {
        provide: CONTRACTS_LIST_SERVICE,
        useClass: ContractsListService,
      },
    ],
  },
];
