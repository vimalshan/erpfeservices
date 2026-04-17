import { GridFileAction } from '@erp-services/shared';

export interface ContractsListItemModel {
  contractId: string;
  contractName: string;
  contractType: string;
  company: string;
  service: string;
  sites: string;
  dateAdded: string;
  actions: GridFileAction[];
  fileName: string;
  documentId: string;
}
