export interface CoBrowsingCompanyListDto {
  isSuccess: boolean;
  message: string;
  errorCode: string;
  data: CoBrowsingCompanyDto[];
}

export interface CoBrowsingCompanyDto {
  id: string;
  companyName: string;
}
