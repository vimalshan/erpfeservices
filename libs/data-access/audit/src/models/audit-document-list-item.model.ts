import { GridFileAction } from '@customer-portal/shared';

export interface AuditDocumentListItemModel {
  documentId: number;
  fileName: string;
  fileType: string;
  dateAdded: string;
  uploadedBy: string;
  actions: GridFileAction[];
  canBeDeleted: boolean;
}
