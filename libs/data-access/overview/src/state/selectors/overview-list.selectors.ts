import { Selector } from '@ngxs/store';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { CardDataModel, CustomTreeNode } from '@customer-portal/shared/models';

import {
  OverviewListState,
  OverviewListStateModel,
} from '../overview-list-state';

export class OverviewListSelectors {
  @Selector([OverviewListSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([OverviewListSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([OverviewListSelectors._dataSites])
  static dataSites(dataSites: CustomTreeNode[]): CustomTreeNode[] {
    return dataSites;
  }

  @Selector([OverviewListSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([OverviewListSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([OverviewListSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([OverviewListSelectors._filtersStatusLoaded])
  static filtersLoaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([OverviewListSelectors._filtersStatusIsLoading])
  static filtersIsLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([OverviewListSelectors._filtersStatusError])
  static filtersError(error: string | null): string | null {
    return error;
  }

  @Selector([OverviewListSelectors._overviewCardData])
  static overviewCardData(overviewCardData: CardDataModel[]): CardDataModel[] {
    return overviewCardData;
  }

  @Selector([OverviewListSelectors._hasMorePages])
  static hasMorePages(hasMorePages: boolean) {
    return hasMorePages;
  }

  @Selector([OverviewListSelectors._isLoading])
  static isLoading(_isLoading: boolean): boolean {
    return _isLoading;
  }

  @Selector([OverviewListSelectors._error])
  static error(_error: string | null): string | null {
    return _error;
  }

  @Selector([OverviewListState])
  private static _error(state: OverviewListStateModel): string | null {
    return state.error;
  }

  @Selector([OverviewListState])
  private static _isLoading(state: OverviewListStateModel): boolean {
    return state.isLoading;
  }

  @Selector([OverviewListState])
  private static _hasMorePages(state: OverviewListStateModel): boolean {
    return (
      (state.allOverviewCardData?.length || 0) > state.pageInfo.currentPage * 4
    );
  }

  @Selector([OverviewListState])
  private static _overviewCardData(
    state: OverviewListStateModel,
  ): CardDataModel[] {
    return state.overviewCardData;
  }

  @Selector([OverviewListState])
  private static _filtersStatusLoaded(state: OverviewListStateModel): boolean {
    return state.filtersStatus.loaded;
  }

  @Selector([OverviewListState])
  private static _filtersStatusIsLoading(
    state: OverviewListStateModel,
  ): boolean {
    return state.filtersStatus.isLoading;
  }

  @Selector([OverviewListState])
  private static _filtersStatusError(
    state: OverviewListStateModel,
  ): string | null {
    return state.filtersStatus.error;
  }

  @Selector([OverviewListState])
  private static _filterSites(state: OverviewListStateModel): number[] {
    return state.filterSites;
  }

  @Selector([OverviewListState])
  private static _filterServices(state: OverviewListStateModel): number[] {
    return state.filterServices;
  }

  @Selector([OverviewListState])
  private static _filterCompanies(state: OverviewListStateModel): number[] {
    return state.filterCompanies;
  }

  @Selector([OverviewListState])
  private static _dataSites(state: OverviewListStateModel): CustomTreeNode[] {
    return structuredClone(state.dataSites);
  }

  @Selector([OverviewListState])
  private static _dataServices(
    state: OverviewListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataServices;
  }

  @Selector([OverviewListState])
  private static _dataCompanies(
    state: OverviewListStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataCompanies;
  }
}
