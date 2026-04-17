export interface ContractsExcelPayloadDto {
  filters: {
    contractName: string[] | null;
    contractType: string[] | null;
    company: string[] | null;
    siteName: string[] | null;
    service: string[] | null;
    dateAdded: string[] | null;
  };
}
