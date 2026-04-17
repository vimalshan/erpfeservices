import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@customer-portal/environments';

export const customHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  // Only set the subscription key header. Do not force withCredentials here
  // because that causes browsers to include credentials and triggers CORS
  // failures when the backend response uses a wildcard origin.
  const modifiedReq = req.clone({
    setHeaders: {
      'Ocp-Apim-Subscription-Key': environment.apimKey,
    },
  });

  return next(modifiedReq);
};
