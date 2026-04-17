import { ServiceDetailsMaster, SiteDetailsMaster } from "@erp-services/shared";

export interface FindingListDto {
  data: FindingListItemDto[];
  isSuccess: boolean;
  message: string;
}

export interface FindingListItemDto {
  findingsId: string;
  findingNumber: string;
  status: string;
  title: string;
  category: string;
  response: string;
  companyId: number;
  services: number[];
  siteId: number;
  openDate: string;
  closedDate: string;
  acceptedDate: string;
}

export interface FindingListItemEnrichedDto extends FindingListItemDto {
  companyName: string;
  serviceDetails: ServiceDetailsMaster[];
  siteDetails: SiteDetailsMaster[];
}