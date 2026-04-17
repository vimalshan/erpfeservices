import { Selector } from '@ngxs/store';

import {
  applyGridConfig,
  applyGridConfigWithoutPagination,
  getNumberOfFilteredRecords,
  isAnyFilterActive,
} from '@customer-portal/shared/helpers/grid';
import {
  FilteringConfig,
  FilterOptions,
} from '@customer-portal/shared/models/grid';

import { ScheduleListItemModel } from '../../models';
import {
  ScheduleListState,
  ScheduleListStateModel,
} from '../schedules-list.state';

export class ScheduleListSelectors {
  @Selector([ScheduleListSelectors._schedules])
  static schedules(
    schedules: ScheduleListItemModel[],
  ): ScheduleListItemModel[] {
    return schedules;
  }

  @Selector([ScheduleListSelectors._allSchedulesList])
  static allSchedulesList(
    schedules: ScheduleListItemModel[],
  ): ScheduleListItemModel[] {
    return schedules;
  }

  @Selector([ScheduleListSelectors._totalFilteredRecords])
  static totalFilteredRecords(totalFilteredRecords: number): number {
    return totalFilteredRecords;
  }

  @Selector([ScheduleListSelectors._filterOptions])
  static filterOptions(filterOptions: FilterOptions): FilterOptions {
    return filterOptions;
  }

  @Selector([ScheduleListSelectors._filteringConfig])
  static filteringConfig(filteringConfig: FilteringConfig): FilteringConfig {
    return filteringConfig;
  }

  @Selector([ScheduleListSelectors._hasActiveFilters])
  static hasActiveFilters(hasActiveFilters: boolean): boolean {
    return hasActiveFilters;
  }

  @Selector([ScheduleListSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([ScheduleListState])
  private static _schedules(
    state: ScheduleListStateModel,
  ): ScheduleListItemModel[] {
    const { schedules, gridConfig } = state;

    return applyGridConfig(schedules, gridConfig);
  }

  @Selector([ScheduleListState])
  private static _allSchedulesList(
    state: ScheduleListStateModel,
  ): ScheduleListItemModel[] {
    const { schedules, gridConfig } = state;

    return applyGridConfigWithoutPagination(schedules, gridConfig);
  }

  @Selector([ScheduleListState])
  private static _totalFilteredRecords(state: ScheduleListStateModel): number {
    const { schedules, gridConfig } = state;

    return getNumberOfFilteredRecords(schedules, gridConfig);
  }

  @Selector([ScheduleListState])
  private static _filterOptions(state: ScheduleListStateModel): FilterOptions {
    return state.filterOptions;
  }

  @Selector([ScheduleListState])
  private static _filteringConfig(
    state: ScheduleListStateModel,
  ): FilteringConfig {
    return state.gridConfig.filtering;
  }

  @Selector([ScheduleListState])
  private static _hasActiveFilters(state: ScheduleListStateModel): boolean {
    return isAnyFilterActive(state.gridConfig.filtering);
  }

  @Selector([ScheduleListState])
  private static _isLoading(state: ScheduleListStateModel): boolean {
    return state.isLoading;
  }
}
