import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '@erp-services/environments';

import { AuthTokenConstants } from '../../constants/auth-constants';
import { AuthServiceResponse, LoginRequest, LoginResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApiUrl = environment.authApiUrl;

  constructor(private readonly http: HttpClient) {}

  login(): void {
    this.clearTokenData();
    window.location.href = `${this.authApiUrl}/api/v1/Auth/login?returnUrl=${encodeURIComponent(environment.baseUrl)}`;
  }

  loginWithCredentials(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApiUrl}/api/v1/Auth/login`, request);
  }

  storeLoginResponse(response: LoginResponse): void {
    if (response.accessToken) {
      localStorage.setItem('access_token', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    if (response.expiresAt) {
      this.storeTokenData(response.expiresAt);
    }
  }

  getStoredAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  storeLoginCredentials(request: LoginRequest): void {
    localStorage.setItem('login_user', request.usernameOrEmail);
  }

  resetLogoutState(): void {
    this.clearTokenData();
  }

  logout(): Observable<string> {
    this.clearTokenData();
    const refreshToken = localStorage.getItem('refresh_token');

    return this.http.post<string>(
      `${this.authApiUrl}/api/v1/Auth/revoke-token`,
      { refreshToken },
    );
  }

  getToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<LoginResponse>(`${this.authApiUrl}/api/v1/Auth/refresh-token`, { refreshToken }).pipe(
      map(response => {
        if (response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
        }
        return response.accessToken;
      })
    );
  }

  getClientCredentialToken(): Observable<string> {
    return this.http.get<string>(`${this.authApiUrl}/api/v1/minimal/auth/health`);
  }

  /** GET /api/v1/Auth/me - validates token and returns user info */
  getMe(): Observable<AuthServiceResponse> {
    return this.http.get<AuthServiceResponse>(`${this.authApiUrl}/api/v1/Auth/me`);
  }

  isUserAuthenticated(): Observable<boolean> {
    return this.getMe().pipe(
      map(user => user.isActive)
    );
  }

  isUserAuthenticatedWithExpiryInfo(): Observable<AuthServiceResponse> {
    return this.getMe().pipe(
      map(user => ({
        ...user,
        isUserAuthenticated: true,
        expiryTimeUtc: localStorage.getItem(AuthTokenConstants.TOKEN_EXPIRY_KEY) || new Date().toISOString(),
      }))
    );
  }

  isUserValidated(): Observable<boolean> {
    return this.getMe().pipe(
      map(user => user.isActive && user.isEmailVerified)
    );
  }

  storeTokenData(expiresAt: string): void {
    localStorage.setItem(AuthTokenConstants.TOKEN_EXPIRY_KEY, expiresAt);
  }

  clearTokenData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('login_user');
    localStorage.removeItem(AuthTokenConstants.SHOW_MODAL_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(AuthTokenConstants.LAST_ACTIVITY_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_DURATION_KEY);
  }

  isLogOutInProgress(): boolean {
    return !localStorage.getItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
  }
}
