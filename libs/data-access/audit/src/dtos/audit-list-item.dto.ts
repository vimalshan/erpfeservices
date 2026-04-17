import { ServiceDetailsMaster, SiteDetailsMaster } from "@customer-portal/shared";

export interface AuditListItemDto {
  type: string;
  startDate?: string;
  endDate?: string;
  leadAuditor: string;
  auditId: number;
  status: string;
  companyId: number;
  sites: number[];
  services: number[];
}

export interface AuditListItemEnrichedDto extends AuditListItemDto {
  companyName: string;
  siteDetails: SiteDetailsMaster[];
  serviceDetails: ServiceDetailsMaster[];
}