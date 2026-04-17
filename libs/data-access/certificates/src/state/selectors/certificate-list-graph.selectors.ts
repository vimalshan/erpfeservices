import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  BarChartModel,
  CustomTreeNode,
  DoughnutChartModel,
  TreeColumnDefinition,
} from '@customer-portal/shared/models';

import { CertificateListItemEnrichedDto } from '../../dtos';
import {
  CertificateListGraphState,
  CertificateListGraphStateModel,
} from '../certificate-list-graph.state';

export class CertificateListGraphSelectors {
  @Selector([CertificateListGraphSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([CertificateListGraphSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([CertificateListGraphSelectors._dataSites])
  static dataSites(dataSites: CustomTreeNode[]): CustomTreeNode[] {
    return dataSites;
  }

  @Selector([CertificateListGraphSelectors._certificateItems])
  static certificateItems(
    certificateItems: CertificateListItemEnrichedDto[],
  ): CertificateListItemEnrichedDto[] {
    return certificateItems;
  }

  @Selector([CertificateListGraphSelectors._filterStartDate])
  static filterStartDate(filterStartDate: Date | null): Date | null {
    return filterStartDate;
  }

  @Selector([CertificateListGraphSelectors._filterEndDate])
  static filterEndDate(filterEndDate: Date | null): Date | null {
    return filterEndDate;
  }

  @Selector([CertificateListGraphSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([CertificateListGraphSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([CertificateListGraphSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([CertificateListGraphSelectors._filterDateRange])
  static filterDateRange(filterDateRange: Date[]): Date[] {
    return filterDateRange;
  }

  @Selector([CertificateListGraphSelectors._certificatesByStatusGraphData])
  static certificatesByStatusGraphData(
    certificatesByStatusGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return certificatesByStatusGraphData;
  }

  @Selector([CertificateListGraphSelectors._certificatesByTypeGraphData])
  static certificatesByTypeGraphData(
    certificatesByTypeGraphData: BarChartModel,
  ): BarChartModel {
    return certificatesByTypeGraphData;
  }

  @Selector([CertificateListGraphSelectors._certificatesBySiteData])
  static certificatesBySiteData(
    certificatesBySiteData: TreeNode[],
  ): TreeNode[] {
    return certificatesBySiteData;
  }

  @Selector([CertificateListGraphSelectors._certificatesBySiteColumns])
  static certificatesBySiteColumns(
    certificatesBySiteColumns: Record<string, TreeColumnDefinition[]>,
  ): Record<string, TreeColumnDefinition[]> {
    return certificatesBySiteColumns;
  }

  @Selector([CertificateListGraphSelectors._isLoadingCertificateBySite])
  static isLoadingCertificateBySite(
    isLoadingCertificateBySite: boolean,
  ): boolean {
    return isLoadingCertificateBySite;
  }

  @Selector([CertificateListGraphState])
  private static _isLoadingCertificateBySite(
    state: CertificateListGraphStateModel,
  ): boolean {
    return state.sites.loading;
  }

  @Selector([CertificateListGraphState])
  private static _certificatesBySiteColumns(
    state: CertificateListGraphStateModel,
  ): Record<string, TreeColumnDefinition[]> {
    return state?.certificatesBySiteColumns ?? [];
  }

  @Selector([CertificateListGraphState])
  private static _certificatesBySiteData(
    state: CertificateListGraphStateModel,
  ): TreeNode[] {
    return state?.sites.list ?? [];
  }

  @Selector([CertificateListGraphState])
  private static _certificatesByTypeGraphData(
    state: CertificateListGraphStateModel,
  ): BarChartModel {
    return state.certificatesByTypeGraphData;
  }

  @Selector([CertificateListGraphState])
  private static _certificatesByStatusGraphData(
    state: CertificateListGraphStateModel,
  ): DoughnutChartModel {
    return state.certificatesByStatusGraphData;
  }

  @Selector([CertificateListGraphState])
  private static _filterDateRange(
    state: CertificateListGraphStateModel,
  ): Date[] {
    const { filterStartDate, filterEndDate } = state || {};

    if (filterStartDate && filterEndDate) {
      return [filterStartDate, filterEndDate];
    }

    return [];
  }

  @Selector([CertificateListGraphState])
  private static _filterSites(state: CertificateListGraphStateModel): number[] {
    return state.filterSites;
  }

  @Selector([CertificateListGraphState])
  private static _filterServices(
    state: CertificateListGraphStateModel,
  ): number[] {
    return state.filterServices;
  }

  @Selector([CertificateListGraphState])
  private static _filterCompanies(
    state: CertificateListGraphStateModel,
  ): number[] {
    return state.filterCompanies;
  }

  @Selector([CertificateListGraphState])
  private static _filterStartDate(
    state: CertificateListGraphStateModel,
  ): Date | null {
    return state.filterStartDate;
  }

  @Selector([CertificateListGraphState])
  private static _filterEndDate(
    state: CertificateListGraphStateModel,
  ): Date | null {
    return state.filterEndDate;
  }

  @Selector([CertificateListGraphState])
  private static _dataCompanies(
    state: CertificateListGraphStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataCompanies;
  }

  @Selector([CertificateListGraphState])
  private static _dataServices(
    state: CertificateListGraphStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataServices;
  }

  @Selector([CertificateListGraphState])
  private static _dataSites(
    state: CertificateListGraphStateModel,
  ): CustomTreeNode[] {
    return structuredClone(state.dataSites);
  }

  @Selector([CertificateListGraphState])
  private static _certificateItems(
    state: CertificateListGraphStateModel,
  ): CertificateListItemEnrichedDto[] {
    return state.certificateItems;
  }
}
