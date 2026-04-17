import { BaseApolloResponse,
  ServiceDetailsMaster, SiteDetailsMaster
 } from '@customer-portal/shared';

export interface ScheduleListDto extends BaseApolloResponse<ScheduleListItemDto[]> {
  data: ScheduleListItemDto[];
}

export interface ScheduleListItemDto {
  siteAuditId: number;
  startDate: string;
  endDate: string;
  status: string;
  serviceIds: number[];
  siteId: number;
  auditType: string;
  leadAuditor: string;
  siteRepresentatives: string[];
  companyId: number;
  siteAddress: string;
  auditID: number;  
  reportingCountry: string;
  projectNumber: string;
  accountDNVId: number;  
}

export interface ScheduleListItemEnrichedDto extends ScheduleListItemDto {
  companyName: string;
  serviceDetails: ServiceDetailsMaster[];
  siteDetails: SiteDetailsMaster[];
  statusId: number;
}
export interface ScheduleListCalendarFilterSitesDataDto {
  id: number;
  label: string;
  children?: ScheduleListCalendarFilterSitesDataDto[];
}
