import { AuditSiteListItemDto } from './audit-site-list-item.dto';

export interface SitesListDto {
  data: AuditSiteListItemDto[];
  message: string;
  isSuccess: boolean;
}
