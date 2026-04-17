import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ContractsExcelPayloadDto,
  ContractsListExportDto,
} from '../../../dtos';

export interface IContractsListService {
  getContractsList(): Observable<any>;
  exportContractsExcel(
    filters: ContractsExcelPayloadDto,
  ): Observable<ContractsListExportDto>;
}

export const CONTRACTS_LIST_SERVICE = new InjectionToken<IContractsListService>(
  'contracts.contracts-list-service',
);
