import { BaseApolloResponse } from '@customer-portal/shared';
import { AuditListItemDto } from './audit-list-item.dto';

export interface AuditListDto extends BaseApolloResponse<AuditListItemDto[]> {
    data: AuditListItemDto[];
}

export interface AuditListResponseDto {
    data: {
        viewAudits: AuditListDto;
    };
    errors?: any[];
}