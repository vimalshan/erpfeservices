export interface AuditDocumentsListDto {
  data: AuditDocumentListItemDto[];
  isSuccess: boolean;
  message: string;
}

export interface AuditDocumentListItemDto {
  documentId: number;
  fileName: string;
  type: string;
  dateAdded: string;
  uploadedBy: string;
  canBeDeleted: boolean;
  currentSecurity: string;
}
