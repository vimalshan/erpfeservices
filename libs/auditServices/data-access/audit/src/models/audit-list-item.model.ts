export interface AuditListItemModel {
  auditNumber: string;
  status: string;
  companyName: string;
  service: string;
  site: string;
  city: string;
  country: string;
  type: string;
  startDate?: string;
  endDate?: string;
  leadAuthor: string;
}
