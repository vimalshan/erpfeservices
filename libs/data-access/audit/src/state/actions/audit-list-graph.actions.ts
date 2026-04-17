import {
  BarChartModel,
  DoughnutChartModel,
  FilterValue,
  IndividualFilter,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { AuditChartFilterKey, AuditChartsTabs } from '../../constants';
import { AuditListItemEnrichedDto } from '../../dtos';
import { AuditDaysGridModel } from '../../models';

export class LoadAuditListAndGraphFilters {
  static readonly type = '[Audit List Graph] Load List and Graph Filters';
}

export class UpdateAuditListGraphFilterByKey {
  static readonly type = '[Audit List Graph] Update Filter';

  constructor(
    public data: unknown,
    public key: AuditChartFilterKey,
  ) {}
}

export class UpdateAuditListGraphFilterCompanies {
  static readonly type = '[Audit List Graph] Update Selected Companies';

  constructor(public data: number[]) {}
}

export class UpdateAuditListGraphFilterServices {
  static readonly type = '[Audit List Graph] Update Selected Services';

  constructor(public data: number[]) {}
}

export class UpdateAuditListGraphFilterSites {
  static readonly type = '[Audit List Graph]  Update Selected Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateAuditListGraphFilteredDateRange {
  static readonly type = '[Audit List Graph] Update Selected Date Range';

  constructor(public data: Date[]) {}
}

export class UpdateAuditListGraphData {
  static readonly type = '[AuditListGraph] Update Graph Data';

  constructor(public audits: AuditListItemEnrichedDto[]) {}
}

export class NavigateFromAuditListChartToListView {
  static readonly type =
    '[AuditListGraph] Navigate From Audit list Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}

export class ResetAuditListGraphFiltersExceptDateToCurrentYear {
  static readonly type =
    '[AuditListGraph] Reset All Filters Except Date To Current Year';
}

export class ResetAuditsListGraphState {
  static readonly type = '[AuditListGraph] Reset Audit List Graphs State';
}

// #region audit days charts actions

export class SetActiveAuditsListGraphTab {
  static readonly type = '[AuditListGraph] Set Active Audit List Graph Tab';

  constructor(public activeTab: AuditChartsTabs) {}
}

export class LoadAuditListGraphsData {
  static readonly type = '[AuditListGraph] Load Audit List Graphs Data';
}

export class LoadAuditListDaysDoughnutGraphData {
  static readonly type =
    '[AuditListGraph] Load Audit List Days Doughnut Graph Data';
}

export class LoadAuditListDaysDoughnutGraphDataSuccess {
  static readonly type =
    '[AuditListGraph] Load Audit List Days Doughnut Graph Data Success';

  constructor(public auditDaysDoughnutGraphData: DoughnutChartModel) {}
}

export class LoadAuditListDaysBarGraphData {
  static readonly type = '[AuditListGraph] Load Audit List Days Bar Graph Data';
}

export class LoadAuditListDaysBarGraphDataSuccess {
  static readonly type =
    '[AuditListGraph] Load Audit List Days Bar Graph Data Success';

  constructor(public auditDaysBarGraphData: BarChartModel) {}
}

export class LoadAuditListDaysGridData {
  static readonly type = '[AuditListGraph] Load Audit List Days Grid Data';
}

export class LoadAuditListDaysGridDataSuccess {
  static readonly type =
    '[AuditListGraph] Load Audit List Days Grid Data Success';

  constructor(public auditDaysGridData: AuditDaysGridModel[]) {}
}

export class NavigateFromAuditListChartTreeToListView {
  static readonly type = '[AuditListGraph] Navigate From Tree To List View';

  constructor(public filterValue: IndividualFilter) {}
}

// #endregion audit days charts actions
