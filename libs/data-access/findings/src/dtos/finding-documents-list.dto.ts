export interface FindingDocumentsListDto {
  data: FindingDocumentListItemDto[];
  isSuccess: boolean;
  message: string;
}

export interface FindingDocumentListItemDto {
  documentId: number;
  fileName: string;
  type: string;
  dateAdded: string;
  uploadedBy: string;
  documentUrl: string;
  canBeDeleted: boolean;
}
