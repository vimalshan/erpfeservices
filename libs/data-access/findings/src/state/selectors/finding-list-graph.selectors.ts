import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';

import { FindingListItemEnrichedDto } from '../../dtos';
import { FindingTrendsGraphModel } from '../../models';
import {
  FindingListGraphState,
  FindingListGraphStateModel,
} from '../finding-list-graph.state';

export class FindingListGraphSelectors {
  @Selector([FindingListGraphSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([FindingListGraphSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([FindingListGraphSelectors._dataSites])
  static dataSites(dataSites: CustomTreeNode[]): CustomTreeNode[] {
    return dataSites;
  }

  @Selector([FindingListGraphSelectors._findingItems])
  static findingItems(
    findingItems: FindingListItemEnrichedDto[],
  ): FindingListItemEnrichedDto[] {
    return findingItems;
  }

  @Selector([FindingListGraphSelectors._filterStartDate])
  static filterStartDate(filterStartDate: Date | null): Date | null {
    return filterStartDate;
  }

  @Selector([FindingListGraphSelectors._filterEndDate])
  static filterEndDate(filterEndDate: Date | null): Date | null {
    return filterEndDate;
  }

  @Selector([FindingListGraphSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([FindingListGraphSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([FindingListGraphSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([FindingListGraphSelectors._filterDateRange])
  static filterDateRange(filterDateRange: Date[]): Date[] {
    return filterDateRange;
  }

  @Selector([FindingListGraphSelectors._findingsByStatusGraphData])
  static findingsByStatusGraphData(
    findingsByStatusGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return findingsByStatusGraphData;
  }

  @Selector([FindingListGraphSelectors._findingStatusByCategoryGraphData])
  static findingStatusByCategoryGraphData(
    findingStatusByCategoryGraphData: BarChartModel,
  ): BarChartModel {
    return findingStatusByCategoryGraphData;
  }

  @Selector([FindingListGraphSelectors._overdueFindingsGraphData])
  static overdueFindingsGraphData(
    overdueFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return overdueFindingsGraphData;
  }

  @Selector([FindingListGraphSelectors._becomingOverdueFindingsGraphData])
  static becomingOverdueFindingsGraphData(
    becomingOverdueFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return becomingOverdueFindingsGraphData;
  }

  @Selector([FindingListGraphSelectors._inProgressFindingsGraphData])
  static inProgressFindingsGraphData(
    inProgressFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return inProgressFindingsGraphData;
  }

  @Selector([FindingListGraphSelectors._earlyStageFindingsGraphData])
  static earlyStageFindingsGraphData(
    earlyStageFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return earlyStageFindingsGraphData;
  }

  @Selector([FindingListGraphSelectors._overdueFindingsLoaded])
  static overdueFindingsLoaded(overdueFindingsLoaded: boolean): boolean {
    return overdueFindingsLoaded;
  }

  @Selector([FindingListGraphSelectors._becomingOverdueFindingsLoaded])
  static becomingOverdueFindingsLoaded(
    becomingOverdueFindingsLoaded: boolean,
  ): boolean {
    return becomingOverdueFindingsLoaded;
  }

  @Selector([FindingListGraphSelectors._inProgressFindingsLoaded])
  static inProgressFindingsLoaded(inProgressFindingsLoaded: boolean): boolean {
    return inProgressFindingsLoaded;
  }

  @Selector([FindingListGraphSelectors._earlyStageFindingsLoaded])
  static earlyStageFindingsLoaded(earlyStageFindingsLoaded: boolean): boolean {
    return earlyStageFindingsLoaded;
  }

  @Selector([FindingListGraphSelectors._findingsByStatusLoaded])
  static findingsByStatusLoaded(findingsByStatusLoaded: boolean): boolean {
    return findingsByStatusLoaded;
  }

  @Selector([FindingListGraphSelectors._findingStatusByCategoryLoaded])
  static findingStatusByCategoryLoaded(
    findingStatusByCategoryLoaded: boolean,
  ): boolean {
    return findingStatusByCategoryLoaded;
  }

  @Selector([FindingListGraphSelectors._findingsClauseByClauseListLoaded])
  static findingsClauseByClauseListLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._findingsClauseByClauseListLoading])
  static findingsClauseByClauseListLoading(loading: boolean): boolean {
    return loading;
  }

  @Selector([FindingListGraphSelectors._findingsClauseByClauseList])
  static findingsClauseByClauseList(data: TreeNode[]): TreeNode[] {
    return data;
  }

  @Selector([FindingListGraphSelectors._findingsClauseByClauseListError])
  static findingsClauseByClauseListError(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._findingsClauseByClauseListGradient])
  static findingsClauseByClauseListGradient(data: {
    [key: string]: Map<number, string>;
  }): { [key: string]: Map<number, string> } {
    return data;
  }

  @Selector([FindingListGraphSelectors._findingsBySiteList])
  static findingsBySiteList(data: TreeNode[]): TreeNode[] {
    return data;
  }

  @Selector([FindingListGraphSelectors._findingsBySiteListLoaded])
  static findingsBySiteListLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._findingsBySiteListError])
  static findingsBySiteListError(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._findingTrendsGraphData])
  static findingTrendsGraphData(
    graphData: FindingTrendsGraphModel,
  ): FindingTrendsGraphModel {
    return graphData;
  }

  @Selector([FindingListGraphSelectors._findingTrendsGraphDataLoaded])
  static findingTrendsGraphDataLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._findingTrendsGraphDataError])
  static findingTrendsGraphDataError(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._findingTrendsData])
  static findingTrendsData(data: TreeNode[]): TreeNode[] {
    return data;
  }

  @Selector([FindingListGraphSelectors._findingTrendsDataLoaded])
  static findingTrendsDataLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._findingTrendsDataError])
  static findingTrendsDataError(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._findingTrendsColumns])
  static findingTrendsColumns(
    data: TreeColumnDefinition[],
  ): TreeColumnDefinition[] {
    return data;
  }

  @Selector([FindingListGraphSelectors._findingTrendsColumnsLoaded])
  static findingTrendsColumnsLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._findingTrendsColumnsError])
  static findingTrendsColumnsError(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._findingTrendsGradient])
  static findingTrendsGradient(data: Map<number, string>): Map<number, string> {
    return data;
  }

  @Selector([FindingListGraphSelectors._findingTrendsGradientLoaded])
  static findingTrendsGradientLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._findingTrendsGradientError])
  static findingTrendsGradientError(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._findingsBySiteListGradient])
  static findingsBySiteListGradient(findingsBySiteListGradient: {
    [key: string]: Map<number, string>;
  }) {
    return findingsBySiteListGradient;
  }

  @Selector([FindingListGraphSelectors._loading])
  static loading(loading: boolean): boolean {
    return loading;
  }

  @Selector([FindingListGraphSelectors._loaded])
  static loaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([FindingListGraphSelectors._error])
  static error(error: string | null): string | null {
    return error;
  }

  @Selector([FindingListGraphSelectors._allFindingItems])
  static allFindingItems(
    allFindingItems: FindingListItemEnrichedDto[],
  ): FindingListItemEnrichedDto[] {
    return allFindingItems;
  }

  @Selector([FindingListGraphSelectors._findingsBySiteListColumns])
  static findingsBySiteListColumns(
    findingsBySiteListColumns: TreeColumnDefinition[],
  ): TreeColumnDefinition[] {
    return findingsBySiteListColumns;
  }

  @Selector([FindingListGraphSelectors._findingsClauseByClauseColumns])
  static findingsClauseByClauseColumns(
    findingsClauseByClauseColumns: TreeColumnDefinition[],
  ): TreeColumnDefinition[] {
    return findingsClauseByClauseColumns;
  }

  @Selector([FindingListGraphState])
  private static _findingsClauseByClauseColumns(
    state: FindingListGraphStateModel,
  ): TreeColumnDefinition[] {
    return state.findingsClause.byClauseColumns ?? [];
  }

  @Selector([FindingListGraphState])
  private static _findingsBySiteListColumns(
    state: FindingListGraphStateModel,
  ): TreeColumnDefinition[] {
    return state.findingsBySiteListColumns;
  }

  @Selector([FindingListGraphState])
  private static _allFindingItems(
    state: FindingListGraphStateModel,
  ): FindingListItemEnrichedDto[] {
    return state.allFindingItems;
  }

  @Selector([FindingListGraphState])
  private static _loading(state: FindingListGraphStateModel): boolean {
    return state.loading;
  }

  @Selector([FindingListGraphState])
  private static _loaded(state: FindingListGraphStateModel): boolean {
    return state.loaded;
  }

  @Selector([FindingListGraphState])
  private static _error(state: FindingListGraphStateModel): string | null {
    return state.error;
  }

  @Selector([FindingListGraphState])
  private static _findingsBySiteListGradient(
    state: FindingListGraphStateModel,
  ): {
    [key: string]: Map<number, string>;
  } {
    return state?.findingsBySiteListGradient ?? {};
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsGraphData(
    state: FindingListGraphStateModel,
  ): FindingTrendsGraphModel {
    return state.findingTrends.graphData.data;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsGraphDataLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingTrends.graphData.loaded;
  }

  @Selector([FindingListGraphState])
  private static _findingsClauseByClauseListError(
    state: FindingListGraphStateModel,
  ): string | null {
    return state.findingsClause.byClauseList.error;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsGraphDataError(
    state: FindingListGraphStateModel,
  ): string | null {
    return state.findingTrends.graphData.error;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsData(
    state: FindingListGraphStateModel,
  ): TreeNode[] {
    return state.findingTrends.data.data;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsDataLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingTrends.data.loaded;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsDataError(
    state: FindingListGraphStateModel,
  ): string | null {
    return state.findingTrends.data.error;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsColumns(
    state: FindingListGraphStateModel,
  ): TreeColumnDefinition[] {
    return state.findingTrends.columns.data;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsColumnsLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingTrends.columns.loaded;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsColumnsError(
    state: FindingListGraphStateModel,
  ): string | null {
    return state.findingTrends.columns.error;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsGradient(
    state: FindingListGraphStateModel,
  ): Map<number, string> {
    return state.findingTrends.gradient.data;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsGradientLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingTrends.gradient.loaded;
  }

  @Selector([FindingListGraphState])
  private static _findingTrendsGradientError(
    state: FindingListGraphStateModel,
  ): string | null {
    return state.findingTrends.gradient.error;
  }

  @Selector([FindingListGraphState])
  private static _findingsBySiteList(
    state: FindingListGraphStateModel,
  ): TreeNode[] {
    return state.findingsBySiteList.data ?? [];
  }

  @Selector([FindingListGraphState])
  private static _findingsBySiteListLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingsBySiteList.loaded ?? false;
  }

  @Selector([FindingListGraphState])
  private static _findingsBySiteListError(
    state: FindingListGraphStateModel,
  ): string | null {
    return state.findingsBySiteList.error ?? null;
  }

  @Selector([FindingListGraphState])
  private static _findingsClauseByClauseListGradient(
    state: FindingListGraphStateModel,
  ): { [key: string]: Map<number, string> } {
    return state.findingsClause.byClauseListGradient ?? {};
  }

  @Selector([FindingListGraphState])
  private static _findingsClauseByClauseList(
    state: FindingListGraphStateModel,
  ): TreeNode[] {
    return state.findingsClause.byClauseList?.data ?? [];
  }

  @Selector([FindingListGraphState])
  private static _findingsClauseByClauseListLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingsClause.byClauseList?.loaded ?? false;
  }

  @Selector([FindingListGraphState])
  private static _findingsClauseByClauseListLoading(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingsClause.byClauseList.loading;
  }

  @Selector([FindingListGraphState])
  private static _findingStatusByCategoryLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingStatus.byCategory.loaded;
  }

  @Selector([FindingListGraphState])
  private static _findingsByStatusLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.findingStatus.byStatus.loaded;
  }

  @Selector([FindingListGraphState])
  private static _earlyStageFindingsLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.openFindings?.earlyStage?.loaded ?? false;
  }

  @Selector([FindingListGraphState])
  private static _inProgressFindingsLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.openFindings?.inProgress?.loaded ?? false;
  }

  @Selector([FindingListGraphState])
  private static _becomingOverdueFindingsLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.openFindings?.becomingOverdue?.loaded ?? false;
  }

  @Selector([FindingListGraphState])
  private static _overdueFindingsLoaded(
    state: FindingListGraphStateModel,
  ): boolean {
    return state.openFindings?.overdue?.loaded ?? false;
  }

  @Selector([FindingListGraphState])
  private static _becomingOverdueFindingsGraphData(
    state: FindingListGraphStateModel,
  ): BarChartModel {
    return state.openFindings?.becomingOverdue?.data ?? {};
  }

  @Selector([FindingListGraphState])
  private static _inProgressFindingsGraphData(
    state: FindingListGraphStateModel,
  ): BarChartModel {
    return state.openFindings?.inProgress?.data ?? {};
  }

  @Selector([FindingListGraphState])
  private static _earlyStageFindingsGraphData(
    state: FindingListGraphStateModel,
  ): BarChartModel {
    return state.openFindings?.earlyStage?.data ?? {};
  }

  @Selector([FindingListGraphState])
  private static _overdueFindingsGraphData(
    state: FindingListGraphStateModel,
  ): BarChartModel {
    return state.openFindings?.overdue?.data ?? {};
  }

  @Selector([FindingListGraphState])
  private static _findingStatusByCategoryGraphData(
    state: FindingListGraphStateModel,
  ): BarChartModel {
    return state.findingStatus.byCategory.data;
  }

  @Selector([FindingListGraphState])
  private static _findingsByStatusGraphData(
    state: FindingListGraphStateModel,
  ): DoughnutChartModel {
    return state?.findingStatus.byStatus.data;
  }

  @Selector([FindingListGraphState])
  private static _filterDateRange(state: FindingListGraphStateModel): Date[] {
    const { filterStartDate, filterEndDate } = state || {};

    if (filterStartDate && filterEndDate) {
      return [filterStartDate, filterEndDate];
    }

    return [];
  }

  @Selector([FindingListGraphState])
  private static _filterSites(state: FindingListGraphStateModel): number[] {
    return state.filterSites;
  }

  @Selector([FindingListGraphState])
  private static _filterServices(state: FindingListGraphStateModel): number[] {
    return state.filterServices;
  }

  @Selector([FindingListGraphState])
  private static _filterCompanies(state: FindingListGraphStateModel): number[] {
    return state.filterCompanies;
  }

  @Selector([FindingListGraphState])
  private static _filterStartDate(
    state: FindingListGraphStateModel,
  ): Date | null {
    return state.filterStartDate;
  }

  @Selector([FindingListGraphState])
  private static _filterEndDate(
    state: FindingListGraphStateModel,
  ): Date | null {
    return state.filterEndDate;
  }

  @Selector([FindingListGraphState])
  private static _dataCompanies(
    state: FindingListGraphStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataCompanies;
  }

  @Selector([FindingListGraphState])
  private static _dataServices(
    state: FindingListGraphStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataServices;
  }

  @Selector([FindingListGraphState])
  private static _dataSites(
    state: FindingListGraphStateModel,
  ): CustomTreeNode[] {
    return structuredClone(state.dataSites);
  }

  @Selector([FindingListGraphState])
  private static _findingItems(
    state: FindingListGraphStateModel,
  ): FindingListItemEnrichedDto[] {
    return state.findingItems;
  }
}
