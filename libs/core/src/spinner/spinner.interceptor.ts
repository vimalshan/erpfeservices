import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { CurrentRouteService } from '../route';
import { SpinnerService } from './spinner.service';

export const mySpinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const spinnerService = inject(SpinnerService);
  const currentRouteService = inject(CurrentRouteService);

  if (req.headers.has('SKIP_LOADING')) {
    return next(req);
  }

  const queryParams = req.body?.query || req.urlWithParams;
  const routeKey = currentRouteService.getRouteKey() || 'default';
  spinnerService.setLoading(true, queryParams, routeKey);

  return next(req).pipe(
    finalize(() => {
      spinnerService.setLoading(false, queryParams, routeKey);
    }),
  );
};
