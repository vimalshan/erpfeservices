import { FilterValue, GridConfig } from '@customer-portal/shared';

import { FindingListItemModel } from '../../models';

export class LoadFindingsList {
  static readonly type = '[Findings List] Load Findings List Items';
}

export class LoadFindingsListSuccess {
  static readonly type = '[Findings List] Load Findings List Items Success';

  constructor(public findingsItems: FindingListItemModel[]) {}
}
export class LoadFindingsListFail {
  static readonly type = '[Findings List] Load Findings List Fail';
}
export class UpdateGridConfig {
  static readonly type = '[Findings List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Findings List] Update Filter Options';
}

export class ExportFindingsExcel {
  static readonly type = '[Findings List] Export Findings Excel';
}

export class ExportFindingsExcelSuccess {
  static readonly type = '[Findings List] Export Findings Excel Success';

  constructor(public input: number[]) {}
}

export class ExportFindingsExcelFail {
  static readonly type = '[Findings List] Export Findings Excel Fail';
}

export class ResetFindingsListState {
  static readonly type = '[Findings List] Reset Findings List State';
}

export class SetNavigationGridConfig {
  static readonly type = '[Fidnings List] Set Navigation Grid Config';

  constructor(public chartNavigationPayload: FilterValue[]) {}
}

export class ApplyNavigationFiltersFromOverview {
  static readonly type =
    '[FindingsList] Apply Navigation Filters From Overview';
}
