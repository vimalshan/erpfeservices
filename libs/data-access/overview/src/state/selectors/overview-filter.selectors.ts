import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared';

import { OverviewState, OverviewStateModel } from '../overview.state';

export class OverviewFilterSelectors {
  @Selector([OverviewFilterSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([OverviewFilterSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([OverviewFilterSelectors._dataSites])
  static dataSites(dataSites: TreeNode[]): TreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([OverviewFilterSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([OverviewFilterSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([OverviewFilterSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([OverviewState])
  private static _dataCompanies(
    state: OverviewStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCompanies;
  }

  @Selector([OverviewState])
  private static _dataServices(
    state: OverviewStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataServices;
  }

  @Selector([OverviewState])
  private static _dataSites(state: OverviewStateModel): TreeNode[] {
    return state?.dataSites;
  }

  @Selector([OverviewState])
  private static _filterCompanies(state: OverviewStateModel): number[] {
    return state?.filterCompanies;
  }

  @Selector([OverviewState])
  private static _filterServices(state: OverviewStateModel): number[] {
    return state?.filterServices;
  }

  @Selector([OverviewState])
  private static _filterSites(state: OverviewStateModel): number[] {
    return state?.filterSites;
  }
}
