import { environment } from '@customer-portal/environments';


export enum ServiceNowFeature {
  HOME = 'HOME',
  CATALOG_ITEM = 'CATALOG_ITEM',
  DNV_INVOICE = 'DNV_INVOICE',
  DNV_SCHEDULE = 'DNV_SCHEDULE',
  DNV_CERTIFICATE = 'DNV_CERTIFICATE',
  DNV_COMPANY = 'DNV_COMPANY',
}

export const ServiceNowSysId = 'sc_cat_item';
export const ServiceNowTable = 'sn_customerservice_case';
export const ServiceNowCaseDetailsId = 'ec_case_details';

export const ServiceNowSysIdMap: { [K in ServiceNowFeature]: string } = {
  [ServiceNowFeature.HOME]: '',
  [ServiceNowFeature.CATALOG_ITEM]: environment.serviceNow.sysIds.catalogItem,
  [ServiceNowFeature.DNV_INVOICE]: environment.serviceNow.sysIds.dnvInvoice,
  [ServiceNowFeature.DNV_SCHEDULE]: environment.serviceNow.sysIds.dnvSchedule,
  [ServiceNowFeature.DNV_CERTIFICATE]:
    environment.serviceNow.sysIds.dnvCertificate,
  [ServiceNowFeature.DNV_COMPANY]:
    environment.serviceNow.sysIds.dnvCompanySettings,
};

export enum ServiceNowCssClass {
  WRAPPER = 'ecEmbedWrapper',
  DOCK_OUT = 'dockOut',
  DOCK_IN = 'dockIn',
}
