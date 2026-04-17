export interface AuditFindingListDto {
  data: AuditFindingListItemDto[];
  isSuccess: boolean;
  message: string; 
}

export interface AuditFindingListItemDto {
  acceptedDate: string;
  auditId: string;
  category: string;
  closedDate: string;
  companyId: number;
  findingNumber: string;
  findingsId: string;
  openDate: string;
  services: number[];
  siteId: number;
  status: string;
  title: string;
}
