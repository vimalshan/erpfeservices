import { EnvironmentModel } from './environment.model';

export const environment: EnvironmentModel = {
  api: 'http://localhost:3000/',
  apimKey: '5f5a3d56d8d846eb9e52281f23edf1a7',
  appInsights: {
    instrumentationKey: '015e1a5d-853a-46b3-ab22-aa4019ea842e',
  },
  authApiUrl: 'http://localhost:7136/api/authorize',
  baseUrl: 'https://portal.dev.dnv.com',
  certificateGraphqlHost:
    'https://testapi.dnv.com/ba-scecp-r2-certificateservice-dev',
  contactGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-contactservice-dev',
  dnvLink: 'https://www.dnv.com/',
  documentsApi:
    'https://testapi.dnv.com/ba-scecpservices-r2-dev/v1/api/Documents',
  federatedLogoutUrl:
    'https://login.veracity.com/a68572e3-63ce-4bc1-acdc-b64943502e9d/oauth2/v2.0/logout?p=b2c_1a_signinwithadfsidp&post_logout_redirect_uri=https://www.veracity.com/auth/logout?redirectUri=',
  findingGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-findingservice-dev',
  invoicesGraphqlHost: 'https://testapi.dnv.com/ba-scecp-financialservice-dev',
  auditGraphqlHost: 'https://testapi.dnv.com/ba-scecp-r2-auditservice-dev',
  powerBi: {
    accessToken: '',
    reportId: '4e19ccf9-1ff9-4a04-bd2d-1bab9cb1c029',
    embedUrl:
      'https://app.powerbi.com/reportEmbed?reportId=4e19ccf9-1ff9-4a04-bd2d-1bab9cb1c029&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU5PUlRILUVVUk9QRS1FLVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlLCJkaXNhYmxlQW5ndWxhckpTQm9vdHN0cmFwUmVwb3J0RW1iZWQiOnRydWV9fQ%3d%3d',
  },
  production: false,
  scheduleGraphqlHost:
    'https://testapi.dnv.com/ba-scecp-r2-scheduleservice-dev',
  veracityUrl: 'https://id.veracity.com/',
  notificationGraphqlHost:
    'https://testapi.dnv.com/ba-scecp-notificationservice-dev',
  lmsUrl:
    'https://dnvtest.seertechsolutions.com/auth/oauth2/authorization/veracity',
  serviceNow: {
    moduleId:
      'https://customerservice-dev.dnv.com/#21e5e3d53baca2101cfcd2c5e4e45a63',
    scriptUrl: 'https://customerservice-dev.dnv.com/scripts/sn_csm_ec.js?v=5.6',
    sysIds: {
      catalogItem: '826bc6dd3b34a6501cfcd2c5e4e45af5',
      dnvInvoice: '4508b6b73b34aa101cfcd2c5e4e45a8f',
      dnvSchedule: 'd216bef33b34aa101cfcd2c5e4e45aaa',
      dnvCertificate: '47f372733b34aa101cfcd2c5e4e45a65',
      dnvCompanySettings: 'a8a43a5b2b3a6a501450ff65d891bf5f',
      dnvReschedule: '9a1f10fd3bfe22501cfcd2c5e4e45adc',
    },
  },
  cacheDuration: 3600000,
};
