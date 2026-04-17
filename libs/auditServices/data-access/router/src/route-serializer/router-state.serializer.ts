import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngxs/router-plugin';

import { PageConfig, StoreRouterStateModel } from '../models';

// Map the router snapshot to { url, params, queryParams, data }
export class CustomRouterStateSerializer
  implements RouterStateSerializer<StoreRouterStateModel>
{
  serialize(routerState: RouterStateSnapshot): StoreRouterStateModel {
    const {
      url,
      root: { queryParams },
    } = routerState;

    let { root: route } = routerState;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const { params, data: originalData, routeConfig } = route;
    // Create a new data object instead of modifying the original
    const data = { ...originalData };

    // If the route has a data property, merge it with the existing data
    if (route.params['title']) {
      data['title'] = route.params['title'];
    }

    if (!data['title'] && routeConfig && routeConfig.title) {
      data['title'] = routeConfig.title;
    }

    const routeData: PageConfig = data as PageConfig;

    return { url, params, queryParams, data: routeData };
  }
}
