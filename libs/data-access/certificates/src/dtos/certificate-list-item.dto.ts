import { ServiceDetailsMaster, SiteDetailsMaster } from "@customer-portal/shared";

export interface CertificateListItemDto {
  certificateId: number;
  certificateNumber: string;
  companyId: number;
  status: string;
  issuedDate: string;
  validUntil: string;
  siteIds: number[];
  serviceIds: number[];
  revisionNumber: number;
}

export interface CertificateListItemEnrichedDto extends CertificateListItemDto {
  companyName: string;
  siteDetails: SiteDetailsMaster[];
  serviceDetails: ServiceDetailsMaster[];
}