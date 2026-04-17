export interface DocumentDeleteDto {
  data: boolean;
  isSuccess: boolean;
  message: string;
  error: { fileName: string; errorCode: string };
}
