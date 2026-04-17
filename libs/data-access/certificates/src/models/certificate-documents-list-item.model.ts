import { GridFileAction } from '@customer-portal/shared';

export interface CertificateDocumentsListItemModel {
  documentId: number;
  fileName: string;
  type: string;
  dateAdded: string;
  uploadedBy: string;
  language: string;
  canBeDeleted: boolean;
  currentSecurity: string;
  contactEmail: string;
  actions: GridFileAction[];
}
