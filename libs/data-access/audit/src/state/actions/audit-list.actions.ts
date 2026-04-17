import { FilterValue, GridConfig } from '@customer-portal/shared';

import { AuditListItemModel } from '../../models';

export class LoadAuditList {
  static readonly type = '[Audit List] Load Audit List Items';
}

export class LoadAuditListSuccess {
  static readonly type = '[Audit List] Load Audit List Items Success';

  constructor(public auditItems: AuditListItemModel[]) {}
}
export class LoadAuditListFail {
  static readonly type = '[Audit List] Load Audit List Fail';
}

export class UpdateGridConfig {
  static readonly type = '[Audit List] Update Grid Config';

  constructor(public gridConfig: GridConfig) {}
}

export class UpdateFilterOptions {
  static readonly type = '[Audit List] Update Filter Options';
}

export class ExportAuditsExcel {
  static readonly type = '[Audit List] Export Audits Excel';
}

export class ExportAuditsExcelSuccess {
  static readonly type = '[Audit List] Export Audits Excel Success';

  constructor(public input: number[]) {}
}

export class ExportAuditsExcelFail {
  static readonly type = '[Audit List] Export Audits Excel Fail';
}

export class ResetAuditListState {
  static readonly type = '[Audit List] Reset Audit List State';
}

export class SetNavigationGridConfig {
  static readonly type = '[Audit List] Set Navigation Grid Config';

  constructor(public chartNavigationPayload: FilterValue[]) {}
}

export class ApplyNavigationFiltersFromOverview {
  static readonly type = '[AuditList] Apply Navigation Filters From Overview';
}
