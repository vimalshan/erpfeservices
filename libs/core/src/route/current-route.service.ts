import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CurrentRouteService {
  private routeKey = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Include query params in the routeKey
        const urlTree = this.router.parseUrl(event.urlAfterRedirects);
        const { queryParams } = urlTree;
        const queryString = Object.keys(queryParams).length
          ? `?${new URLSearchParams(queryParams).toString()}`
          : '';
        this.routeKey = urlTree.root.children['primary']
          ? urlTree.root.children['primary'].segments
              .map((s) => s.path)
              .join('/')
          : event.urlAfterRedirects;
        this.routeKey = `/${this.routeKey}${queryString}`;
      });
  }

  getRouteKey(): string {
    return this.routeKey;
  }
}
