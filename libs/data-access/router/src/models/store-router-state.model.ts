import { Params } from '@angular/router';

export interface StoreRouterStateModel {
  url: string;
  params: Params;
  queryParams: Params;
  data: PageConfig;
}

export interface PageConfig {
  breadcrumb?: {
    i18nKey: string;
    isHidden: boolean;
  };
  pageViewRequest?: string;
  title?: string;
}
