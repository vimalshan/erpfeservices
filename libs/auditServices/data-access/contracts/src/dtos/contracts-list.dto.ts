export interface ContractsListDto {
  data: ContractListItemDto[];
  isSuccess: boolean;
  message: string;
}

export interface ContractListItemDto {
  contractId: string;
  contractName: string;
  contractType: string;
  company: string;
  service: string;
  sites: string;
  dateAdded: string;
}
