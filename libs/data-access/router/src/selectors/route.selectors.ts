import { RouterState, RouterStateModel } from '@ngxs/router-plugin';
import { Selector } from '@ngxs/store';

import { StoreRouterStateModel } from '../models';

export class RouteSelectors {
  @Selector([RouterState])
  static data({ state }: RouterStateModel<StoreRouterStateModel>) {
    return state?.data ?? null;
  }

  @Selector()
  static getPathParamByKey({ state }: RouterStateModel<StoreRouterStateModel>) {
    return (pathParamKey: string) => state?.params[pathParamKey] ?? null;
  }

  @Selector()
  static getQueryParamByKey({
    state,
  }: RouterStateModel<StoreRouterStateModel>) {
    return (queryParamKey: string) => state?.queryParams[queryParamKey] ?? null;
  }

  @Selector([RouterState])
  static url({ state }: RouterStateModel<StoreRouterStateModel>) {
    return state?.url;
  }
}
