export interface AuditDeleteDocumentResponse {
  data: boolean;
  isSuccess: boolean;
  message: string;
  error: { fileName: string; errorCode: string };
}
