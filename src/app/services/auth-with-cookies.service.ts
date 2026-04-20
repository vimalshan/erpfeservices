import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from '@erp-services/environments';
import { AuthTokenConstants } from '@erp-services/shared/constants/auth-constants';
import { AuthServiceResponse, LoginRequest, LoginResponse } from '@erp-services/shared';

/**
 * Enhanced Auth Service with Cookie-based Token Management
 * Replaces localStorage with cookies for better security
 */
@Injectable({
  providedIn: 'root',
})
export class AuthServiceWithCookies {
  private readonly authApiUrl = environment.authApiUrl;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly LOGIN_USER_KEY = 'login_user';
  private readonly TOKEN_DURATION = 7; // Token valid for 7 days

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {}

  /**
   * Login with credentials
   */
  loginWithCredentials(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApiUrl}/api/v1/Auth/login`, request);
  }

  /**
   * Store login response in cookies
   */
  storeLoginResponse(response: LoginResponse): void {
    if (response.accessToken) {
      this.cookieService.setCookie(this.ACCESS_TOKEN_KEY, response.accessToken, this.TOKEN_DURATION);
    }
    if (response.refreshToken) {
      this.cookieService.setCookie(this.REFRESH_TOKEN_KEY, response.refreshToken, this.TOKEN_DURATION);
    }
    if (response.expiresAt) {
      this.storeTokenData(response.expiresAt);
    }
  }

  /**
   * Get stored access token from cookie
   */
  getStoredAccessToken(): string | null {
    return this.cookieService.getCookie(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get stored refresh token from cookie
   */
  getStoredRefreshToken(): string | null {
    return this.cookieService.getCookie(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Store login credentials in cookie
   */
  storeLoginCredentials(request: LoginRequest): void {
    this.cookieService.setCookie(this.LOGIN_USER_KEY, request.usernameOrEmail, this.TOKEN_DURATION);
  }

  /**
   * Get logged-in username from cookie
   */
  getLoggedInUsername(): string | null {
    return this.cookieService.getCookie(this.LOGIN_USER_KEY);
  }

  /**
   * Store token expiration data
   */
  storeTokenData(expiresAt: string): void {
    this.cookieService.setCookie(this.TOKEN_EXPIRY_KEY, expiresAt, this.TOKEN_DURATION);
  }

  /**
   * Get token expiration
   */
  getTokenExpiry(): string | null {
    return this.cookieService.getCookie(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    try {
      const expiryDate = new Date(expiry);
      return new Date() > expiryDate;
    } catch {
      return true;
    }
  }

  /**
   * Validate token is still valid
   */
  isTokenValid(): boolean {
    const token = this.getStoredAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Get user information (validates token)
   */
  getMe(): Observable<AuthServiceResponse> {
    return this.http.get<AuthServiceResponse>(`${this.authApiUrl}/api/v1/Auth/me`);
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): Observable<boolean> {
    return this.getMe().pipe(
      map(user => user.isActive)
    );
  }

  /**
   * Refresh access token using refresh token
   */
  getToken(): Observable<string> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<LoginResponse>(`${this.authApiUrl}/api/v1/Auth/refresh-token`, { refreshToken }).pipe(
      map(response => {
        if (response.accessToken) {
          this.cookieService.setCookie(this.ACCESS_TOKEN_KEY, response.accessToken, this.TOKEN_DURATION);
        }
        if (response.expiresAt) {
          this.storeTokenData(response.expiresAt);
        }
        return response.accessToken;
      })
    );
  }

  /**
   * Logout and clear all authentication cookies
   */
  logout(): Observable<string> {
    const refreshToken = this.getStoredRefreshToken();
    
    // Clear cookies first
    this.clearTokenData();
    
    // Revoke token on server if we have a refresh token
    if (refreshToken) {
      return this.http.post<string>(
        `${this.authApiUrl}/api/v1/Auth/revoke-token`,
        { refreshToken }
      );
    }
    
    return new Observable(observer => {
      observer.next('Logged out');
      observer.complete();
    });
  }

  /**
   * Clear all authentication cookies
   */
  clearTokenData(): void {
    this.cookieService.deleteCookie(this.ACCESS_TOKEN_KEY);
    this.cookieService.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.cookieService.deleteCookie(this.LOGIN_USER_KEY);
    this.cookieService.deleteCookie(this.TOKEN_EXPIRY_KEY);
    this.cookieService.deleteCookie(AuthTokenConstants.SHOW_MODAL_KEY);
    this.cookieService.deleteCookie(AuthTokenConstants.LAST_ACTIVITY_KEY);
    this.cookieService.deleteCookie(AuthTokenConstants.TOKEN_DURATION_KEY);
  }

  /**
   * Check if logout is in progress
   */
  isLogOutInProgress(): boolean {
    return !this.cookieService.hasCookie(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Reset logout state
   */
  resetLogoutState(): void {
    this.clearTokenData();
  }
}
