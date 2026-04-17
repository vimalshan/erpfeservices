import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loadingRequestsMap: Map<string, Set<string>> = new Map();
  private loadingSubject = new BehaviorSubject<boolean>(false);

  isLoading$ = this.loadingSubject.asObservable();

  setLoading(loading: boolean, query: string, routeKey: string): void {
    if (!this.loadingRequestsMap.has(routeKey)) {
      this.loadingRequestsMap.set(routeKey, new Set());
    }
    const requests = this.loadingRequestsMap.get(routeKey)!;

    if (loading) {
      requests.add(query);
    } else {
      requests.delete(query);

      if (requests.size === 0) {
        this.loadingRequestsMap.delete(routeKey);
      }
    }
    this.updateLoadingState(routeKey);
  }

  isLoadingForRoute(routeKey: string): boolean {
    return (this.loadingRequestsMap.get(routeKey)?.size ?? 0) > 0;
  }

  private updateLoadingState(routeKey: string) {
    this.loadingSubject.next(this.isLoadingForRoute(routeKey));
  }
}
