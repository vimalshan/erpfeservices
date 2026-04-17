import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    window.location.href = `${this.authApiUrl}/login?returnUrl=${encodeURIComponent(environment.baseUrl)}`;
  }

  loginWithCredentials(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApiUrl}/token`, request, {
      withCredentials: true,
    });
  }

  storeLoginResponse(response: LoginResponse): void {
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    if (response.expires) {
      this.storeTokenData(response.expires);
    }
  }

  storeLoginCredentials(request: LoginRequest): void {
    localStorage.setItem('login_user', request.userName);
  }

  resetLogoutState(): void {
    this.clearTokenData();
  }

  logout(): Observable<string> {
    this.clearTokenData();

    return this.http.post<string>(
      `${this.authApiUrl}/Logout`,
      {},
      { responseType: 'text' as 'json', withCredentials: true },
    );
  }

  getToken(): Observable<string> {
    return this.http.get(`${this.authApiUrl}/GetAccessToken`, {
      responseType: 'text',
      withCredentials: true,
    });
  }

  getClientCredentialToken(): Observable<string> {
    return this.http.get<string>(`${this.authApiUrl}/Status`);
  }

  isUserAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.authApiUrl}/IsUserAuthenticated`, {
      withCredentials: true,
    });
  }

  isUserAuthenticatedWithExpiryInfo(): Observable<AuthServiceResponse> {
    return this.http.get<AuthServiceResponse>(
      `${this.authApiUrl}/UserAuthenticatedwithExpiry`,
      {
        withCredentials: true,
      },
    );
  }

  isUserValidated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.authApiUrl}/ValidateUser`);
  }

  storeTokenData(expiresAt: string): void {
    localStorage.setItem(AuthTokenConstants.TOKEN_EXPIRY_KEY, expiresAt);
  }

  clearTokenData(): void {
    localStorage.removeItem(AuthTokenConstants.SHOW_MODAL_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(AuthTokenConstants.LAST_ACTIVITY_KEY);
    localStorage.removeItem(AuthTokenConstants.TOKEN_DURATION_KEY);
  }

  isLogOutInProgress(): boolean {
    return !localStorage.getItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
  }
}
