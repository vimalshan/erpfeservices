import { Injectable } from '@angular/core';

/**
 * Service to manage cookies for authentication tokens
 */
@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly DOMAIN = 'localhost'; // Change for production
  private readonly SECURE = false; // Set to true in production (HTTPS only)
  private readonly HTTP_ONLY = false; // Set to true if accessible via HttpOnly

  /**
   * Set a cookie
   */
  setCookie(
    name: string,
    value: string,
    expirationDays: number = 7,
    path: string = '/'
  ): void {
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const domain = `domain=${this.DOMAIN}`;
    const sameSite = 'SameSite=Strict';
    const secure = this.SECURE ? 'Secure' : '';
    
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=${path};${domain};${sameSite};${secure}`;
  }

  /**
   * Get a cookie value by name
   */
  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie
   */
  deleteCookie(name: string, path: string = '/'): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
  }

  /**
   * Check if a cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies
   */
  getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');
    
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    }
    return cookies;
  }

  /**
   * Clear all cookies
   */
  clearAllCookies(path: string = '/'): void {
    const cookies = this.getAllCookies();
    for (const name in cookies) {
      if (cookies.hasOwnProperty(name)) {
        this.deleteCookie(name, path);
      }
    }
  }
}
