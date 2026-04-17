import { inject, Injectable } from '@angular/core';

import { environment } from '@customer-portal/environments';

import { LoggingService } from '../app-insights/logging.service';
import { ServiceNowClient, ServiceNowConfig } from './service-now.config';
import {
  ServiceNowCssClass,
  ServiceNowFeature,
  ServiceNowSysId,
  ServiceNowSysIdMap,
} from './service-now.constants';
import {
  BaseServiceNowParams,
  CertificateParams,
  CompanySettingsParams,
  InvoiceParams,
  NotificationParms,
  ScheduleParams,
} from './service-now.models';
import { featureContexts } from './service-now-feature-context';

declare global {
  interface Window {
    SN_CSM_EC?: ServiceNowClient;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ServiceNowService {
  private moduleID = environment.serviceNow.moduleId;
  private initialized = false;
  private readonly loggingService = inject(LoggingService);

  openCatalogItemSupport(
    params: BaseServiceNowParams,
    openOnLoad = true,
  ): void {
    this.openServiceNowSupport(ServiceNowFeature.HOME, params, openOnLoad);
  }

  openNotificationItemSupport(
    params: NotificationParms,
    openOnLoad = true,
  ): void {
    this.openServiceNowSupport(
      ServiceNowFeature.CATALOG_ITEM,
      params,
      openOnLoad,
    );
  }

  openInvoiceSupport(params: InvoiceParams, openOnLoad = true): void {
    this.openServiceNowSupport(
      ServiceNowFeature.DNV_INVOICE,
      params,
      openOnLoad,
    );
  }

  openScheduleSupport(params: ScheduleParams, openOnLoad = true): void {
    this.openServiceNowSupport(
      ServiceNowFeature.DNV_SCHEDULE,
      params,
      openOnLoad,
    );
  }

  openCertificateSupport(params: CertificateParams, openOnLoad = true): void {
    this.openServiceNowSupport(
      ServiceNowFeature.DNV_CERTIFICATE,
      params,
      openOnLoad,
    );
  }

  openCompanySettingsSupport(
    params: CompanySettingsParams,
    openOnLoad = true,
  ): void {
    this.openServiceNowSupport(
      ServiceNowFeature.DNV_COMPANY,
      params,
      openOnLoad,
    );
  }

  closeMessenger(): void {
    if (!window.SN_CSM_EC) {
      return;
    }

    try {
      if (this.isMessengerOpen()) {
        window.SN_CSM_EC.close();
      }
    } catch (error) {
      this.handleError(error, 'Failed to close ServiceNow messenger');
    }
  }

  private isMessengerOpen(): boolean {
    const messengerWrapper = document.querySelector(
      `.${ServiceNowCssClass.WRAPPER}`,
    );

    if (!messengerWrapper) {
      return false;
    }

    return (
      messengerWrapper.classList.contains(ServiceNowCssClass.DOCK_OUT) ||
      messengerWrapper.classList.contains(ServiceNowCssClass.DOCK_IN)
    );
  }

  private openServiceNowSupport<T extends Partial<BaseServiceNowParams>>(
    feature: ServiceNowFeature,
    params: T,
    openOnLoad = true,
  ): void {
    const defaultSysId =
      feature !== ServiceNowFeature.HOME ? ServiceNowSysIdMap[feature] : '';
    const sysId = params.sys_id ?? defaultSysId;
    this.initServiceNow({
      moduleID: this.moduleID,
      loadFeature: {
        feature,
        openOnLoad,
        params:
          feature !== ServiceNowFeature.HOME
            ? {
                id: params.id ?? ServiceNowSysId,
                sys_id: sysId,
                ...params,
              }
            : { ...params },
      },
    });
  }

  private initializeFeatures(): void {
    if (this.initialized || !window.SN_CSM_EC) {
      return;
    }

    try {
      featureContexts.forEach((context) => {
        window.SN_CSM_EC?.addNewFeatureContext(context);
      });

      this.initialized = true;
    } catch (error) {
      this.handleError(
        error,
        'Failed to initialize ServiceNow feature contexts',
      );
    }
  }

  private initServiceNow(config: ServiceNowConfig): void {
    if (!window.SN_CSM_EC) {
      throw new Error('ServiceNow Engagement Messenger script is not loaded');
    }

    this.initializeFeatures();

    try {
      window.SN_CSM_EC.init(config);
    } catch (error) {
      this.handleError(
        error,
        'Failed to initialize ServiceNow Engagement Messenger',
        {
          config: this.createSafeConfig(config),
        },
      );
    }
  }

  private createSafeConfig(
    config: ServiceNowConfig,
  ): Partial<ServiceNowConfig> {
    const safeConfig = { ...config };

    if (safeConfig.moduleID) {
      safeConfig.moduleID = safeConfig.moduleID.split('/').pop() || '';
    }

    return safeConfig;
  }

  private handleError(
    error: unknown,
    message: string,
    context: Record<string, unknown> = {},
  ): never {
    const enhancedError =
      error instanceof Error
        ? error
        : new Error(String(error) || 'Unknown error');

    enhancedError.name = 'ServiceNowError';
    enhancedError.message = `${message}: ${enhancedError.message}`;

    (enhancedError as any).context = context;

    this.loggingService.logException(enhancedError);

    throw enhancedError;
  }
}
