export interface CertificationMarksListItemDto {
  description: string;
  link: string;
}

export interface CertificationMarksListDto {
  data: CertificationMarksListItemDto[];
  isSuccess: boolean;
  message: string;
  errorCode: string;
}
