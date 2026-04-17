import { TreeNode } from 'primeng/api';

import {
  BarChartModel,
  DoughnutChartModel,
  FilterValue,
  SharedSelectTreeChangeEventOutput,
  TreeColumnDefinition,
} from '@customer-portal/shared';

import { FindingChartFilterKey } from '../../constants';
import { FindingTabs, FindingTrendsGraphModel } from '../../models';

export class ResetFindingListGraphState {
  static readonly type = '[Finding List Graphs] Reset Finding List Graph State';
}

export class SetActiveFindingListGraphTab {
  static readonly type = '[Finding List Graphs] Set Active Findings Tab';

  constructor(public activeTab: FindingTabs) {}
}

export class LoadFindingListAndGraphFilters {
  static readonly type = '[Finding List Graph] Load List and Graph Filters';
}

export class LoadFindingListAndGraphFiltersFail {
  static readonly type =
    '[Finding List Graph] Load List and Graph Filters Fail';

  constructor(public error: Error) {}
}

export class UpdateFindingListGraphFilterByKey {
  static readonly type = '[Finding List Graph] Update Filter';

  constructor(
    public data: unknown,
    public key: FindingChartFilterKey,
  ) {}
}

export class UpdateFindingListGraphFilterCompanies {
  static readonly type = '[Finding List Graph] Update Selected Companies';

  constructor(public data: number[]) {}
}

export class UpdateFindingListGraphFilterServices {
  static readonly type = '[Finding List Graph] Update Selected Services';

  constructor(public data: number[]) {}
}

export class UpdateFindingListGraphFilterSites {
  static readonly type = '[Finding List Graph]  Update Selected Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateFindingListGraphFilteredDateRange {
  static readonly type = '[Finding List Graph] Update Selected Date Range';

  constructor(public data: Date[]) {}
}

export class ResetFindingListGraphFiltersExceptDateToCurrentYear {
  static readonly type =
    '[Finding List Graph] Reset All Filters Except Date To Current Year';
}

export class ResetFindingsListGraphState {
  static readonly type = '[Finding List Graph] Reset Finding List Graphs State';
}

export class LoadFindingListGraphData {
  static readonly type = '[Finding List Graphs] Load Finding List Graph Data';
}

export class LoadFindingListByStatusGraphData {
  static readonly type =
    '[Finding List Graphs] Load Findings by Status Graph Data';
}

export class LoadFindingListByStatusGraphDataSuccess {
  static readonly type =
    '[Finding List Graphs] Load Findings by Status Graph Data Success';

  constructor(public findingsByStatusGraphData: DoughnutChartModel) {}
}

export class LoadFindingListByStatusGraphDataFail {
  static readonly type =
    '[Finding List Graphs] Load Findings by Status Graph Data Fail';

  constructor(public error: Error) {}
}

export class LoadFindingListDataTrendsFail {
  static readonly type =
    '[Finding List Graphs] Load Finding list trend Data Fail';

  constructor(public error: Error) {}
}

export class LoadFindingListStatusByCategoryGraphData {
  static readonly type =
    '[Finding List Graphs] Load Finding  Status By Category Graph Data';
}

export class LoadFindingListStatusByCategoryGraphDataSuccess {
  static readonly type =
    '[Finding List Graphs] Load Finding Status By Category Graph Data Success';

  constructor(public findingStatusByCategoryGraphData: BarChartModel) {}
}

export class LoadFindingListStatusByCategoryGraphDataFail {
  static readonly type =
    '[Finding List Graphs] Load Finding Status By Category Graph Data Fail';

  constructor(public error: Error) {}
}

export class LoadOpenFindingListGraphData {
  static readonly type = '[Finding List Graph] Load Open Findings Graph Data';
}

export class LoadOverdueFindingListGraphData {
  static readonly type =
    '[Finding List Graph] Load Overdue Findings Graph Data';
}

export class LoadOverdueFindingListGraphDataSuccess {
  static readonly type =
    '[Finding List Graph] Load Overdue Findings Graph Data Success';

  constructor(public overdueFindingsGraphData: BarChartModel) {}
}

export class LoadBecomingOverdueFindingListGraphData {
  static readonly type =
    '[Finding List Graph] Load Becoming Overdue Findings Graph Data';
}

export class LoadInProgressFindingListGraphData {
  static readonly type =
    '[Finding List Graph] Load In Progress Findings Graph Data';
}

export class LoadEarlyStageFindingListGraphData {
  static readonly type =
    '[Finding List Graph] Load Early Stage Findings Graph Data';
}

export class LoadFindingListTrendsGraphData {
  static readonly type =
    '[Finding List Graphs] Load Findings Trends Graph Data';
}

export class LoadFindingListTrendsGraphDataSuccess {
  static readonly type =
    '[Finding List Graphs] Load Findings Trends Graph Data Success';

  constructor(public findingsTrendsGraphData: FindingTrendsGraphModel) {}
}

export class LoadFindingListTrendsGraphDataFail {
  static readonly type =
    '[Finding List Graphs] Load Findings Trends Graph Data Fail';

  constructor(public error: Error) {}
}

export class LoadFindingListDataTrends {
  static readonly type = '[Finding List Graphs] Load Findings Data Trends';
}

export class LoadFindingListDataTrendsSuccess {
  static readonly type =
    '[Finding List Graphs] Load Findings Data Trends Success';

  constructor(public data: any) {}
}

export class CreateFindingListDataTrendsColumns {
  static readonly type =
    '[Finding List Graphs] Load Findings Data Trends Columns';

  constructor(public columns: TreeColumnDefinition[]) {}
}

export class CreateFindingListDataTrendsGradient {
  static readonly type =
    '[Finding List Graphs] Load Findings Data Trends Gradient';

  constructor(public trendsGradient: any) {}
}

export class LoadFindingListByClauseList {
  static readonly type = '[Finding List Graphs] Load Findings By Clause Data';
}

export class LoadFindingListByClauseListSuccess {
  static readonly type =
    '[Finding List Graphs] Load Findings By Clause Data Success';

  constructor(public data: TreeNode[]) {}
}

export class LoadFindingListByClauseListFail {
  static readonly type =
    '[Finding List Graphs] Load Findings By Clause Data Fail';

  constructor(public error: Error) {}
}

export class CreateFindingListByClauseDataGradient {
  static readonly type =
    '[Finding List Graphs] Create Findings By Clause Data Gradient';

  constructor(public gradient: { [key: string]: Map<number, string> }) {}
}

export class LoadFindingListBySiteList {
  static readonly type = '[Finding List Graphs] Load Findings By Site Data';
}

export class LoadFindingListBySiteListSuccess {
  static readonly type =
    '[Finding List Graphs] Load Findings By Site Data Success';

  constructor(public data: TreeNode[]) {}
}

export class LoadFindingListBySiteListFail {
  static readonly type =
    '[Finding List Graphs] Load Findings By Site Data Fail';

  constructor(public error: Error) {}
}

export class CreateFindingListBySiteListGradient {
  static readonly type =
    '[Finding List Graphs] Create Findings By Site Data Gradient';

  constructor(public gradient: { [key: string]: Map<number, string> }) {}
}

export class NavigateFromFindingListChartToListView {
  static readonly type =
    '[Finding List Graphs] Navigate From Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}

export class NavigateFromFindingListTreeTableToListView {
  static readonly type =
    '[Finding List Graphs] Navigate From Tree Table To List View';

  constructor(public selectionValues: FilterValue[]) {}
}
