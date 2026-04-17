import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@customer-portal/environments';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept API requests that start with /api/authorize
  if (req.url.startsWith('/api/authorize')) {
    // Replace /api/authorize with the full backend URL
    const fullUrl = req.url.replace('/api/authorize', environment.authApiUrl);
    
    // Clone the request with the new URL and explicitly disable credentials
    const apiRequest = req.clone({
      url: fullUrl,
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': 'http://localhost:4200'
      },
      // Explicitly remove credentials to avoid CORS issues
      body: req.body,
      method: req.method,
      params: req.params,
      responseType: req.responseType,
      reportProgress: req.reportProgress
    });
    
    console.log(`API Interceptor: ${req.url} -> ${fullUrl}`);
    return next(apiRequest);
  }
  
  return next(req);
};