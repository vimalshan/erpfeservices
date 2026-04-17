import { environment } from '@erp-services/environments';


export enum ServiceNowFeature {
  HOME = 'HOME',
  CATALOG_ITEM = 'CATALOG_ITEM',
  SUAADHYA_INVOICE = 'SUAADHYA_INVOICE',
  SUAADHYA_SCHEDULE = 'SUAADHYA_SCHEDULE',
  SUAADHYA_CERTIFICATE = 'SUAADHYA_CERTIFICATE',
  SUAADHYA_COMPANY = 'SUAADHYA_COMPANY',
}

export const ServiceNowSysId = 'sc_cat_item';
export const ServiceNowTable = 'sn_customerservice_case';
export const ServiceNowCaseDetailsId = 'ec_case_details';

export const ServiceNowSysIdMap: { [K in ServiceNowFeature]: string } = {
  [ServiceNowFeature.HOME]: '',
  [ServiceNowFeature.CATALOG_ITEM]: environment.serviceNow.sysIds.catalogItem,
  [ServiceNowFeature.SUAADHYA_INVOICE]: environment.serviceNow.sysIds.suaadhyaInvoice,
  [ServiceNowFeature.SUAADHYA_SCHEDULE]: environment.serviceNow.sysIds.suaadhyaSchedule,
  [ServiceNowFeature.SUAADHYA_CERTIFICATE]:
    environment.serviceNow.sysIds.suaadhyaCertificate,
  [ServiceNowFeature.SUAADHYA_COMPANY]:
    environment.serviceNow.sysIds.suaadhyaCompanySettings,
};

export enum ServiceNowCssClass {
  WRAPPER = 'ecEmbedWrapper',
  DOCK_OUT = 'dockOut',
  DOCK_IN = 'dockIn',
}
