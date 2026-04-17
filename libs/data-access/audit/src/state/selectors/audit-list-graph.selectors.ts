import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
} from '@customer-portal/shared/models';

import { AuditListItemEnrichedDto } from '../../dtos';
import {
  AuditListGraphState,
  AuditListGraphStateModel,
} from '../audit-list-graph.state';

export class AuditListGraphSelectors {
  @Selector([AuditListGraphSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([AuditListGraphSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([AuditListGraphSelectors._dataSites])
  static dataSites(dataSites: CustomTreeNode[]): CustomTreeNode[] {
    return dataSites;
  }

  @Selector([AuditListGraphSelectors._auditItems])
  static auditItems(
    auditItems: AuditListItemEnrichedDto[],
  ): AuditListItemEnrichedDto[] {
    return auditItems;
  }

  @Selector([AuditListGraphSelectors._filterStartDate])
  static filterStartDate(filterStartDate: Date | null): Date | null {
    return filterStartDate;
  }

  @Selector([AuditListGraphSelectors._filterEndDate])
  static filterEndDate(filterEndDate: Date | null): Date | null {
    return filterEndDate;
  }

  @Selector([AuditListGraphSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([AuditListGraphSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([AuditListGraphSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([AuditListGraphSelectors._filterDateRange])
  static filterDateRange(filterDateRange: Date[]): Date[] {
    return filterDateRange;
  }

  @Selector([AuditListGraphSelectors._auditStatusDoughnutGraphData])
  static auditStatusDoughnutGraphData(
    auditStatusDoughnutGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return auditStatusDoughnutGraphData;
  }

  @Selector([AuditListGraphSelectors._auditStatusBarGraphData])
  static auditStatusBarGraphData(
    auditStatusBarGraphData: BarChartModel,
  ): BarChartModel {
    return auditStatusBarGraphData;
  }

  @Selector([AuditListGraphSelectors._auditDaysGridData])
  static auditDaysGridData(auditDaysGridData: TreeNode[]): TreeNode[] {
    return auditDaysGridData;
  }

  @Selector([AuditListGraphSelectors._auditDaysBarGraphData])
  static auditDaysBarGraphData(
    auditDaysBarGraphData: BarChartModel,
  ): BarChartModel {
    return auditDaysBarGraphData;
  }

  @Selector([AuditListGraphSelectors._auditDaysDoughnutGraphData])
  static auditDaysDoughnutGraphData(
    auditDaysDoughnutGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return auditDaysDoughnutGraphData;
  }

  @Selector([AuditListGraphState])
  private static _auditDaysDoughnutGraphData(
    state: AuditListGraphStateModel,
  ): DoughnutChartModel {
    return state.auditDaysDoughnutGraphData;
  }

  @Selector([AuditListGraphState])
  private static _auditDaysBarGraphData(
    state: AuditListGraphStateModel,
  ): BarChartModel {
    return state.auditDaysBarGraphData;
  }

  @Selector([AuditListGraphState])
  private static _auditDaysGridData(
    state: AuditListGraphStateModel,
  ): TreeNode[] {
    return state.auditDaysGridData;
  }

  @Selector([AuditListGraphState])
  private static _auditStatusBarGraphData(
    state: AuditListGraphStateModel,
  ): BarChartModel {
    return state.auditStatusBarGraphData;
  }

  @Selector([AuditListGraphState])
  private static _auditStatusDoughnutGraphData(
    state: AuditListGraphStateModel,
  ): DoughnutChartModel {
    return state.auditStatusDoughnutGraphData;
  }

  @Selector([AuditListGraphState])
  private static _filterDateRange(state: AuditListGraphStateModel): Date[] {
    const { filterStartDate, filterEndDate } = state || {};

    if (filterStartDate && filterEndDate) {
      return [filterStartDate, filterEndDate];
    }

    return [];
  }

  @Selector([AuditListGraphState])
  private static _filterSites(state: AuditListGraphStateModel): number[] {
    return state.filterSites;
  }

  @Selector([AuditListGraphState])
  private static _filterServices(state: AuditListGraphStateModel): number[] {
    return state.filterServices;
  }

  @Selector([AuditListGraphState])
  private static _filterCompanies(state: AuditListGraphStateModel): number[] {
    return state.filterCompanies;
  }

  @Selector([AuditListGraphState])
  private static _filterStartDate(
    state: AuditListGraphStateModel,
  ): Date | null {
    return state.filterStartDate;
  }

  @Selector([AuditListGraphState])
  private static _filterEndDate(state: AuditListGraphStateModel): Date | null {
    return state.filterEndDate;

    return state.filterEndDate;
  }

  @Selector([AuditListGraphState])
  private static _dataCompanies(
    state: AuditListGraphStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataCompanies;
  }

  @Selector([AuditListGraphState])
  private static _dataServices(
    state: AuditListGraphStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataServices;
  }

  @Selector([AuditListGraphState])
  private static _dataSites(state: AuditListGraphStateModel): CustomTreeNode[] {
    return structuredClone(state.dataSites);
  }

  @Selector([AuditListGraphState])
  private static _auditItems(
    state: AuditListGraphStateModel,
  ): AuditListItemEnrichedDto[] {
    return state.auditItems;
  }
}
