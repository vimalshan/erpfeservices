import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../services/cookie.service';

/**
 * HTTP Interceptor that adds authentication token from cookies to all outgoing requests
 */
export const cookieAuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  
  // Get access token from cookie
  const token = cookieService.getCookie('access_token');

  if (token) {
    // Clone the request and add Authorization header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  // Pass through without modification if no token
  return next(req);
};
