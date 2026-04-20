import { Injectable } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthServiceWithCookies } from '../services/auth-with-cookies.service';

/**
 * Route guard that protects routes and requires valid authentication token
 * Uses cookies to persist authentication across sessions
 */
export const cookieAuthGuard: CanActivateFn | CanMatchFn = () => {
  const authService = inject(AuthServiceWithCookies);
  const router = inject(Router);

  // Check if token exists and is valid
  if (authService.isTokenValid()) {
    return true;
  }

  // Try to refresh token if refresh token exists
  const refreshToken = authService.getStoredRefreshToken();
  if (refreshToken) {
    return authService.getToken().pipe(
      map((token) => {
        if (token) {
          return true;
        }
        router.navigate(['/login']);
        return false;
      })
    );
  }

  // No valid token, redirect to login
  router.navigate(['/login']);
  return false;
};

/**
 * Service-based version for compatibility
 */
@Injectable({
  providedIn: 'root'
})
export class CookieAuthGuardService {
  constructor(
    private authService: AuthServiceWithCookies,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isTokenValid()) {
      return true;
    }

    // Redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
