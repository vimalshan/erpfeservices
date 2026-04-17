export interface ActionsListDto {
  items: ActionsDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
export interface ActionsDto {
  id: number;
  action: string;
  dueDate: string;
  highPriority: boolean;
  language: string;
  message: string;
  service: string;
  site: string;
  entityType: string;
  entityId: string;
  subject: string;
}
