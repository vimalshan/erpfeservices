import { GridConfig } from '@customer-portal/shared';

import { ContractsListItemModel } from '../../models';

export class LoadContractsList {
  static readonly type = '[Contracts List] Load Contracts List';
}

export class LoadContractsListSuccess {
  static readonly type = '[Contracts List] Load Contracts List Succes';

  constructor(public contracts: ContractsListItemModel[]) {}
}

export class LoadContractsListFail {
  static readonly type = '[Contracts List] Load Contracts List Fail';
}

export class UpdateGridConfig {
  static readonly type = '[Contracts List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Contracts List] Update Filter Options';
}

export class ExportContractsExcel {
  static readonly type = '[Contracts List] Export Contracts Excel';
}

export class ExportContractsExcelSuccess {
  static readonly type = '[Contracts List] Export Contracts Excel Success';

  constructor(public input: number[]) {}
}

export class ExportContractsExcelFail {
  static readonly type = '[Contracts List] Export Contracts Excel Fail';
}

export class ResetContractsListState {
  static readonly type = '[Contracts List] Reset Contracts List State';
}
