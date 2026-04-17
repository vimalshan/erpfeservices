import { SubAuditListItemDto } from './sub-audit-list-item.dto';

export interface SubAuditListDto {
  message: string;
  isSuccess: boolean;
  data: SubAuditListItemDto[];
}
