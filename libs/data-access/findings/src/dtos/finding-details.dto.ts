import { SiteModel } from '@customer-portal/shared';

export interface FindingDetailsDto {
  data: FindingDetailsItemDto;
  isSuccess: boolean;
}

export interface FindingDetailsItemDto {
  acceptedDate: string;
  auditId: string;
  auditors: string[];
  auditType: string;
  closedDate: string;
  dueDate: string;
  findingNumber: string;
  openedDate: string;
  services: string[];
  sites: SiteModel[];
  status: string;
}
