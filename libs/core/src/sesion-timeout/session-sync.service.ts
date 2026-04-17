import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { AuthTokenConstants } from "../../../auditServices/shared/src";

import { SESSION_STORAGE_KEYS } from './session-timeout.constants';
import { TokenInfo } from './session-token-info.model';

@Injectable({ providedIn: 'root' })
export class SessionSyncService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly MS_TO_MINUTES = 60 * 1000;

  lastActivity = signal<Date | null>(this.getStoredActivity());
  tokenExpiry = signal<string | null>(this.getStoredExpiry());
  tokenDuration = signal<number | null>(this.getStoredDuration());
  showTimeoutModal = signal<boolean>(this.getStoredModalState());

  constructor() {
    window.addEventListener('storage', this.handleStorageEvent);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('storage', this.handleStorageEvent);
    });
  }

  updateTokenExpiry(expiryTime: string): void {
    const tokenInfo = this.calculateTokenInfo(expiryTime);
    this.updateStorage(tokenInfo);
    this.updateSignals(tokenInfo);
  }

  updateLastUserActivity(activityDate: Date = new Date()): void {
    localStorage.setItem(
      AuthTokenConstants.LAST_ACTIVITY_KEY,
      activityDate.toISOString(),
    );

    this.lastActivity.set(activityDate);
  }

  updateModalState(show: boolean): void {
    localStorage.setItem(AuthTokenConstants.SHOW_MODAL_KEY, show.toString());
    this.showTimeoutModal.set(show);
  }

  resetAll(): void {
    SESSION_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    this.lastActivity.set(null);
    this.tokenExpiry.set(null);
    this.tokenDuration.set(null);
    this.showTimeoutModal.set(false);
  }

  private calculateTokenInfo(newExpiryTime: string): TokenInfo {
    const existingExpiry = localStorage.getItem(
      AuthTokenConstants.TOKEN_EXPIRY_KEY,
    );
    const existingDuration = localStorage.getItem(
      AuthTokenConstants.TOKEN_DURATION_KEY,
    );

    const shouldCalculateNewDuration = this.shouldRecalculateDuration(
      newExpiryTime,
      existingExpiry,
      existingDuration,
    );

    const duration = shouldCalculateNewDuration
      ? this.calculateDurationMinutes(new Date(newExpiryTime))
      : parseInt(existingDuration!, 10);

    return { expiry: newExpiryTime, duration };
  }

  private shouldRecalculateDuration(
    newExpiryTime: string,
    existingExpiry: string | null,
    existingDuration: string | null,
  ): boolean {
    if (!existingDuration) {
      return true;
    }

    if (!existingExpiry) {
      return false;
    }

    return new Date(newExpiryTime) > new Date(existingExpiry);
  }

  private updateStorage(tokenInfo: TokenInfo): void {
    localStorage.setItem(AuthTokenConstants.TOKEN_EXPIRY_KEY, tokenInfo.expiry);
    localStorage.setItem(
      AuthTokenConstants.TOKEN_DURATION_KEY,
      tokenInfo.duration.toString(),
    );
    localStorage.setItem(AuthTokenConstants.SHOW_MODAL_KEY, 'false');
  }

  private updateSignals(tokenInfo: TokenInfo): void {
    this.tokenExpiry.set(tokenInfo.expiry);
    this.tokenDuration.set(tokenInfo.duration);
    this.showTimeoutModal.set(false);
  }

  private handleStorageEvent = (event: StorageEvent): void => {
    if (!event.newValue) return;

    switch (event.key) {
      case AuthTokenConstants.LAST_ACTIVITY_KEY: {
        if (event.newValue === this.lastActivity()?.toISOString()) {
          return;
        }
        this.lastActivity.set(new Date(event.newValue));
        break;
      }
      case AuthTokenConstants.TOKEN_EXPIRY_KEY:
        this.tokenExpiry.set(event.newValue);
        break;
      case AuthTokenConstants.TOKEN_DURATION_KEY:
        this.tokenDuration.set(
          event.newValue ? parseInt(event.newValue, 10) : null,
        );
        break;
      case AuthTokenConstants.SHOW_MODAL_KEY:
        this.showTimeoutModal.set(event.newValue === 'true');
        break;
      default:
        break;
    }
  };

  private getStoredActivity(): Date | null {
    const storedActivity = localStorage.getItem(
      AuthTokenConstants.LAST_ACTIVITY_KEY,
    );

    return storedActivity ? new Date(storedActivity) : null;
  }

  private getStoredExpiry(): string | null {
    return localStorage.getItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
  }

  private getStoredDuration(): number | null {
    const storedDuration = localStorage.getItem(
      AuthTokenConstants.TOKEN_DURATION_KEY,
    );

    return storedDuration ? parseInt(storedDuration, 10) : null;
  }

  private getStoredModalState(): boolean {
    return localStorage.getItem(AuthTokenConstants.SHOW_MODAL_KEY) === 'true';
  }

  private calculateDurationMinutes(expiryDate: Date): number {
    const now = new Date();

    return Math.floor(
      (expiryDate.getTime() - now.getTime()) / this.MS_TO_MINUTES,
    );
  }
}
