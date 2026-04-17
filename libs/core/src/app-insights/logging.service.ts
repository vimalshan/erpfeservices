/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { environment } from '@customer-portal/environments';



@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  // private appInsights: any;
  private userEmail: string | null = null;
  private veracityId: string | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    // const { ApplicationInsights } = await import(
    //   '@microsoft/applicationinsights-web'
    // );
    // this.appInsights = new ApplicationInsights({
    //   config: {
    //     instrumentationKey: environment.appInsights?.instrumentationKey,
    //     enableAutoRouteTracking: true,
    //   },
    // });
    // this.appInsights.loadAppInsights();
    this.initialized = true;
  }

  setUserContext(userEmail: string, veracityId?: string): void {
    if (userEmail) {
      this.userEmail = userEmail;

      if (veracityId) {
        this.veracityId = veracityId;
      }

      // this.appInsights.setAuthenticatedUserContext(userEmail, veracityId, true);
    }
  }

  logPageView(
    name?: string,
    uri?: string,
    properties?: Record<string, any>,
  ): void {
    try {
      const enhancedProperties = {
        ...properties,
        userEmail: this.userEmail || 'anonymous',
        veracityId: this.veracityId || 'unknown',
      };

      // this.appInsights.trackPageView({
      //   name,
      //   uri,
      //   properties: enhancedProperties,
      // });
    } catch (e) {
      console.error('Failed to log page view', e);
    }
  }

  logEvent(name: string, properties?: { [key: string]: unknown }): void {
    try {
      const enhancedProperties = {
        ...properties,
        userEmail: this.userEmail || 'anonymous',
        veracityId: this.veracityId || 'unknown',
      };

      // this.appInsights.trackEvent({ name }, enhancedProperties);
    } catch (e) {
      console.error('Failed to log event', e);
    }
  }

  logMetric(
    name: string,
    average: number,
    properties?: { [key: string]: unknown },
  ): void {
    try {
      const enhancedProperties = {
        ...properties,
        userEmail: this.userEmail || 'anonymous',
        veracityId: this.veracityId || 'unknown',
      };

      // this.appInsights.trackMetric({ name, average }, enhancedProperties);
    } catch (e) {
      console.error('Failed to log metric', e);
    }
  }

  logException(exception: Error, severityLevel?: number): void {
    try {
      // this.appInsights.trackException({
      //   exception,
      //   severityLevel,
      //   properties: {
      //     userEmail: this.userEmail || 'anonymous',
      //     veracityId: this.veracityId || 'unknown',
      //   },
      // });
    } catch (e) {
      console.error('Failed to log exception', e);
    }
  }

  logTrace(message: string, properties?: { [key: string]: unknown }): void {
    try {
      const enhancedProperties = {
        ...properties,
        userEmail: this.userEmail || 'anonymous',
        veracityId: this.veracityId || 'unknown',
      };

      // this.appInsights.trackTrace({ message }, enhancedProperties);
    } catch (e) {
      console.error('Failed to log trace', e);
    }
  }

  logToConsole(message: string, properties?: { [key: string]: unknown }): void {
    if (!environment.production) {
      if (properties) {
        console.log(`${message}`, properties);
      } else {
        console.log(message);
      }
    }
  }
}
