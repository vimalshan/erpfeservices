export interface CertificateDocumentsListItemDto {
  documentId: number;
  fileName: string;
  type: string;
  dateAdded: string;
  uploadedBy: string;
  language: string;
  canBeDeleted: boolean;
  currentSecurity: string;
  contactEmail: string;
}

export interface CertificateDocumentsListDto {
  data: CertificateDocumentsListItemDto[];
  isSuccess: boolean;
  message: string;
  error: {
    fileName: string;
    errorCode: string;
  };
}
