import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { filter, map, Observable, take } from 'rxjs';

import { PageConfig } from '../models/store-router-state.model';
import { RouteSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class RouteStoreService {
  constructor(private store: Store) {}

  get routeData(): Signal<PageConfig | null> {
    return this.store.selectSignal(RouteSelectors.data);
  }

  get currentUrl(): Signal<string | undefined> {
    return this.store.selectSignal(RouteSelectors.url);
  }

  getPathParamByKey(paramKey: string): Observable<string> {
    return this.store
      .select((state) => RouteSelectors.getPathParamByKey(state.router))
      .pipe(
        take(1),
        map((selectorFn) => selectorFn(paramKey)),
      );
  }

  getQueryParamByKey(queryParamKey: string): Observable<string> {
    return this.store
      .select((state) => RouteSelectors.getQueryParamByKey(state.router))
      .pipe(
        take(1),
        map((selectorFn) => selectorFn(queryParamKey)),
      );
  }

  /**
   * Get the current URL path from the router state
   * @returns Observable of the URL string, or empty string if not available
   */
  getCurrentUrl(): Observable<string | ''> {
    return this.store.select(RouteSelectors.url).pipe(
      filter((url) => url !== undefined && url !== null),
      take(1),
      map((url) => url || ''),
    );
  }

  /**
   * Get the page title from route data if available
   * @returns Observable of page title or null
   */
  getCurrentPageTitle(): Observable<string | null> {
    return this.store.select(RouteSelectors.data).pipe(
      take(1),
      map((data) => data?.title || null),
    );
  }

  /**
   * Get route data with URL and title information
   * @returns Observable with route data object
   */
  getRouteData(): Observable<{ url: string; title: string | null }> {
    return this.store
      .select((state) => ({
        url: RouteSelectors.url(state.router) || '',
        data: RouteSelectors.data(state.router),
      }))
      .pipe(
        filter((data) => data.url !== undefined && data.url !== null),
        take(1),
        map((data) => ({
          url: data.url,
          title: data.data?.title || null,
        })),
      );
  }
}
