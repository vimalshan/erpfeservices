import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  NgZone,
  OnDestroy,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime, fromEvent, merge, Subscription, timer } from 'rxjs';

import { AuthServiceResponse } from "../../../shared/src";
import { SessionTimeoutModalComponent } from "../../../shared/src";
import { AuthService } from "../../../shared/src";

import { LoggingService } from '../app-insights/logging.service';
import { ServiceNowService } from '../service-now/service-now.service';
import { SessionSyncService } from './session-sync.service';
import { SessionTimeout } from './session-timeout.constants';

@Injectable({ providedIn: 'root' })
export class SessionTimeoutService implements OnDestroy {
  private checkTimerSubscription?: Subscription;
  private activitySubscription?: Subscription;
  private dialogRef: DynamicDialogRef | null = null;
  protected destroyRef = inject(DestroyRef);
  private readonly activityEvents = ['click', 'mousemove', 'keydown', 'scroll'];

  readonly showTimeoutModal = computed(() =>
    this.sessionSync.showTimeoutModal(),
  );
  isInitialized = signal<boolean>(false);
  tokenDurationMinutes = computed(() => this.sessionSync.tokenDuration());

  refreshAtMinute: Signal<number> = computed(() => {
    const duration = this.tokenDurationMinutes() ?? 0;

    return duration - SessionTimeout.BUFFER_TIME_MINUTES + 1;
  });
  readonly triggerMonitor = computed(() => {
    const expiry = this.sessionSync.tokenExpiry();
    if (!expiry) return false;

    const expiryDate = new Date(expiry);

    return expiryDate > new Date();
  });

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private ngZone: NgZone,
    private sessionSync: SessionSyncService,
    private loggingService: LoggingService,
    private serviceNowService: ServiceNowService,
  ) {
    this.initializeMonitoringEffect();
    this.initializeModalEffect();
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
    this.handleSessionTimeoutDialogClose();
  }

  openSessionTimeoutModal(): void {
    if (this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialogService.open(SessionTimeoutModalComponent, {
      modal: true,
      closable: false,
      closeOnEscape: false,
      dismissableMask: false,
    });
  }

  initialize(newExpiryDate: Date): void {
    this.sessionSync.updateTokenExpiry(newExpiryDate.toISOString());
    this.resetActivity();
    this.isInitialized.set(true);
  }

  private resetActivity(): void {
    const currentDate = new Date(Date.now());
    this.sessionSync.updateLastUserActivity(currentDate);
  }

  private initializeMonitoringEffect(): void {
    effect(() => {
      if (!this.shouldStartMonitoring()) return;

      if (this.triggerMonitor()) {
        this.startMonitoring();
      } else {
        this.stopMonitoring();
      }
    });
  }

  private initializeModalEffect(): void {
    effect(() => {
      if (this.showTimeoutModal()) {
        this.openSessionTimeoutModal();
      } else {
        this.handleSessionTimeoutDialogClose();
      }
    });
  }

  private shouldStartMonitoring(): boolean {
    if (!this.isInitialized()) {
      return false;
    }

    return true;
  }

  private startMonitoring(): void {
    if (this.isMonitoringActive()) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.startActivityMonitoring();
      this.startSessionStatusChecks();
    });
  }

  private isMonitoringActive(): boolean {
    return !!(this.checkTimerSubscription || this.activitySubscription);
  }

  private startActivityMonitoring(): void {
    const events = this.createActivityEventStreams();

    this.activitySubscription = merge(...events)
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loggingService.logToConsole('Activity detected');
        this.ngZone.run(() => this.resetActivity());
      });
  }

  private createActivityEventStreams() {
    return this.activityEvents.map((eventName) => fromEvent(window, eventName));
  }

  private startSessionStatusChecks(): void {
    this.checkTimerSubscription = timer(0, SessionTimeout.CHECK_INTERVAL_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.ngZone.run(() => this.checkSessionStatus());
      });
  }

  private stopMonitoring(): void {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      this.activitySubscription = undefined;
    }

    if (this.checkTimerSubscription) {
      this.checkTimerSubscription.unsubscribe();
      this.checkTimerSubscription = undefined;
    }
  }

  private checkSessionStatus(): void {
    if (this.showTimeoutModal()) return;

    const { tokenExpiry, tokenDuration } = this.getTokenInfo();
    if (!this.isValidTokenInfo(tokenExpiry, tokenDuration)) return;

    const timeInfo = this.calculateTimeInfo(tokenExpiry!);

    if (this.isTokenExpired(timeInfo.timeUntilExpiryMs)) {
      this.showSessionModal(true);

      return;
    }

    this.logTimeCheck(timeInfo);

    if (this.isShortDurationToken(tokenDuration!)) {
      this.handleShortDurationToken(timeInfo.timeSinceLastActivityMinutes);

      return;
    }

    if (
      this.isUserIdle(timeInfo.timeSinceLastActivityMinutes, tokenDuration!)
    ) {
      this.showSessionModal(true);

      return;
    }

    if (this.shouldRefreshToken(timeInfo.timeElapsedMinutes)) {
      this.refreshTokenSilently();
    }
  }

  private getTokenInfo() {
    return {
      tokenExpiry: this.sessionSync.tokenExpiry(),
      tokenDuration: this.sessionSync.tokenDuration(),
    };
  }

  private isValidTokenInfo(
    tokenExpiry: string | null,
    tokenDuration: number | null,
  ): boolean {
    return !!tokenExpiry && !!tokenDuration;
  }

  private calculateTimeInfo(tokenExpiry: string) {
    const now = new Date(Date.now());
    const expiryTime = new Date(tokenExpiry);
    const timeUntilExpiryMs = expiryTime.getTime() - now.getTime();
    const timeUntilExpiryMinutes = Math.floor(timeUntilExpiryMs / (60 * 1000));
    const timeSinceLastActivityMinutes = this.getTimeSinceLastActivity();
    const timeElapsedMinutes =
      (this.tokenDurationMinutes() ?? 0) - timeUntilExpiryMinutes;

    return {
      now,
      expiryTime,
      timeUntilExpiryMs,
      timeUntilExpiryMinutes,
      timeSinceLastActivityMinutes,
      timeElapsedMinutes,
    };
  }

  private isTokenExpired(timeUntilExpiryMs: number): boolean {
    if (timeUntilExpiryMs <= 0) {
      return true;
    }

    return false;
  }

  private logTimeCheck(
    timeInfo: ReturnType<typeof this.calculateTimeInfo>,
  ): void {
    this.loggingService.logToConsole('Time check:', {
      currentUtc: timeInfo.now.toISOString(),
      expiryUtc: timeInfo.expiryTime.toISOString(),
      expiryLocal: timeInfo.expiryTime.toLocaleString(),
      tokenDurationMinutes: this.tokenDurationMinutes(),
      timeUntilExpiryMinutes: timeInfo.timeUntilExpiryMinutes,
      timeElapsedMinutes: timeInfo.timeElapsedMinutes,
      timeSinceLastActivityMinutes: timeInfo.timeSinceLastActivityMinutes,
      actualSeconds: this.getActualSecondsSinceLastActivity(),
    });
  }

  private getActualSecondsSinceLastActivity(): number {
    const now = new Date(Date.now());
    const lastActivity = this.sessionSync.lastActivity();

    return lastActivity
      ? (now.getTime() - lastActivity.getTime()) / 1000
      : Number.MAX_SAFE_INTEGER;
  }

  private isShortDurationToken(tokenDuration: number): boolean {
    return tokenDuration <= SessionTimeout.SHORT_TOKEN_THRESHOLD_MINUTES;
  }

  private handleShortDurationToken(timeSinceLastActivityMinutes: number): void {
    if (
      timeSinceLastActivityMinutes <= SessionTimeout.ACTIVITY_WINDOW_MINUTES
    ) {
      this.loggingService.logToConsole(
        'Short duration token with active user, refreshing immediately',
      );
      this.refreshTokenSilently();
    } else {
      this.loggingService.logToConsole(
        'Short duration token with inactive user, logging out',
      );
      this.showSessionModal(true);
    }
  }

  private isUserIdle(
    timeSinceLastActivityMinutes: number,
    tokenDuration: number,
  ): boolean {
    const idleThreshold = Math.round(
      tokenDuration - SessionTimeout.IDLE_THRESHOLD_TIME_MINUTES,
    );
    this.loggingService.logToConsole(
      `Idle threshold ${idleThreshold} minutes and refreshAtMinute ${this.refreshAtMinute()}`,
    );

    return timeSinceLastActivityMinutes >= idleThreshold;
  }

  private shouldRefreshToken(timeElapsedMinutes: number): boolean {
    return timeElapsedMinutes >= this.refreshAtMinute();
  }

  private refreshTokenSilently(): void {
    this.loggingService.logToConsole('Refreshing token silently...');
    this.handleTokenRefresh().subscribe({
      next: (result: AuthServiceResponse) => {
        if (result.isUserAuthenticated) {
          this.handleSuccessfulRefresh(new Date(result.expiryTimeUtc));
        } else {
          this.handleFailedRefresh('Not authenticated');
        }
      },
      error: (error: unknown) => this.handleFailedRefresh(error),
    });
  }

  private handleTokenRefresh() {
    return this.authService
      .isUserAuthenticatedWithExpiryInfo()
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  private handleSuccessfulRefresh(expiryDate: Date): void {
    this.loggingService.logToConsole('Token refresh successful:', {
      currentExpiry: this.sessionSync.tokenExpiry(),
      newExpiry: expiryDate.toISOString(),
      newExpiryLocal: expiryDate.toLocaleString(),
    });

    this.initialize(expiryDate);
  }

  private handleFailedRefresh(error: unknown): void {
    if (error instanceof Error) {
      this.loggingService.logException(error);
    } else {
      this.loggingService.logException(
        new Error(`Token refresh failed: ${String(error)}`),
      );
    }
    this.showSessionModal(true);
  }

  private getTimeSinceLastActivity(): number {
    const now = new Date(Date.now());
    const lastActivity = this.sessionSync.lastActivity();

    if (!lastActivity) {
      return Number.MAX_SAFE_INTEGER;
    }
    const diffInMs = now.getTime() - lastActivity.getTime();

    if (diffInMs > 0 && diffInMs < 60000) {
      return 1;
    }

    const minutes = Math.floor(diffInMs / 60000);

    return minutes;
  }

  private showSessionModal(show: boolean): void {
    this.sessionSync.updateModalState(show);

    if (show) {
      this.authService.clearTokenData();
      this.serviceNowService.closeMessenger();
    }
  }

  private handleSessionTimeoutDialogClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
