import { GridFileAction } from '@erp-services/shared';

export interface AuditDocumentListItemModel {
  documentId: number;
  fileName: string;
  fileType: string;
  dateAdded: string;
  uploadedBy: string;
  actions: GridFileAction[];
  canBeDeleted: boolean;
}
