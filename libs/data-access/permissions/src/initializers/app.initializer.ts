import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { LoggingService } from '@customer-portal/core/app-insights';

import { AppInitializerService } from '../services';

export const appInitializer = (): Observable<any> => {
  const appInitializerService = inject(AppInitializerService);
  const router = inject(Router);

  return appInitializerService.initializePermissions().pipe(
    tap(() => {
      router.initialNavigation();
    }),
  );
};

export function loggingInitializer(): Promise<void> {
  const loggingService = inject(LoggingService);

  return loggingService.init();
}
