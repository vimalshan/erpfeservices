export interface EnvironmentModel {
  api: string;
  apimKey: string;
  appInsights?: {
    instrumentationKey: string;
  };
  authApiUrl: string;
  baseUrl: string;
  certificateGraphqlHost: string;
  contactGraphqlHost: string;
  suaadhyaLink?: string;
  documentsApi: string;
  federatedLogoutUrl: string;
  findingGraphqlHost: string;
  invoicesGraphqlHost: string;
  auditGraphqlHost: string;
  settingsGraphqlHost: string;
  powerBi?: PowerBiCredentials;
  production: boolean;
  scheduleGraphqlHost: string;
  veracityUrl: string;
  notificationGraphqlHost: string;
  lmsUrl: string;
  serviceNow: ServiceNowEnvironmentModel;
  cacheDuration?: number; // in seconds
}

export interface PowerBiCredentials {
  accessToken: string;
  embedUrl: string;
  reportId: string;
}

export interface ServiceNowEnvironmentModel {
  moduleId: string;
  scriptUrl: string;
  sysIds: {
    catalogItem: string;
    suaadhyaInvoice: string;
    suaadhyaSchedule: string;
    suaadhyaCertificate: string;
    suaadhyaCompanySettings: string;
    suaadhyaReschedule: string;
  };
}
