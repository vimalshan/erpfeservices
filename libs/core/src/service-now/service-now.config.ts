import { ServiceNowFeature } from './service-now.constants';
import { BaseServiceNowParams } from './service-now.models';

export interface ServiceNowClient {
  init: (config: ServiceNowConfig) => void;
  open: () => void;
  close: () => void;
  destroy: () => void;
  loadEMFeature: () => void;
  addNewFeatureContext: (featureContext: ServiceNowFeatureContext) => void;
}

export interface ServiceNowConfig {
  moduleID: string;
  loadFeature: ServiceNowFeatureLoadOptions;
}

export interface ServiceNowFeatureContext {
  feature: ServiceNowFeature;
  static: Record<string, string>;
  params: Record<string, string>;
}

export interface ServiceNowFeatureLoadOptions {
  feature: ServiceNowFeature;
  openOnLoad: boolean;
  params?: Record<string, string> | BaseServiceNowParams;
}
