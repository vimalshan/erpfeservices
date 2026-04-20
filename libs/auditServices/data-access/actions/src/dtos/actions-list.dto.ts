export interface ActionsListDto {
  data: ActionsDto[];
  pageInfo: ActionsPageInfo;
}

export interface ActionsPageInfo {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface ActionsDto {
  id: number;
  action: string;
  dueDate: string;
  highPriority: boolean;
  message: string;
  service: string;
  site: string;
  entityType: string;
  entityId: string;
  subject: string;
}
