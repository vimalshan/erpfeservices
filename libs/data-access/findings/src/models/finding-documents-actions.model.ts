export interface DeleteDocumentResponse {
  data: boolean;
  isSuccess: boolean;
  message: string;
  error: { fileName: string; errorCode: string };
}
