import { Selector } from '@ngxs/store';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { CustomTreeNode } from '@customer-portal/shared/models';

import { CalendarScheduleModel } from '../../models';
import {
  ScheduleListCalendarState,
  ScheduleListCalendarStateModel,
} from '../schedule-list-calendar.state';

export class ScheduleListCalendarSelectors {
  @Selector([ScheduleListCalendarSelectors._calendarSchedule])
  static calendarSchedule(
    calendarSchedule: CalendarScheduleModel[],
  ): CalendarScheduleModel[] {
    return calendarSchedule;
  }

  @Selector([ScheduleListCalendarSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([ScheduleListCalendarSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([ScheduleListCalendarSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([ScheduleListCalendarSelectors._filterStatuses])
  static filterStatuses(filterStatuses: number[]): number[] {
    return filterStatuses;
  }

  @Selector([ScheduleListCalendarSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([ScheduleListCalendarSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([ScheduleListCalendarSelectors._dataSites])
  static dataSites(dataSites: CustomTreeNode[]): CustomTreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([ScheduleListCalendarSelectors._dataStatuses])
  static dataStatuses(
    dataStatuses: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataStatuses;
  }

  @Selector([ScheduleListCalendarSelectors._isLoading])
  static isLoading(isLoading: boolean): boolean {
    return isLoading;
  }

  @Selector([ScheduleListCalendarSelectors._error])
  static error(error: string | null): string | null {
    return error;
  }

  @Selector([ScheduleListCalendarSelectors._loaded])
  static loaded(loaded: boolean): boolean {
    return loaded;
  }

  @Selector([ScheduleListCalendarState])
  private static _loaded(state: ScheduleListCalendarStateModel): boolean {
    return state.loaded;
  }

  @Selector([ScheduleListCalendarState])
  private static _error(state: ScheduleListCalendarStateModel): string | null {
    return state.error;
  }

  @Selector([ScheduleListCalendarState])
  private static _isLoading(state: ScheduleListCalendarStateModel): boolean {
    return state.isLoading;
  }

  @Selector([ScheduleListCalendarState])
  private static _dataStatuses(
    state: ScheduleListCalendarStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataStatuses;
  }

  @Selector([ScheduleListCalendarState])
  private static _dataSites(
    state: ScheduleListCalendarStateModel,
  ): CustomTreeNode[] {
    return state.dataSites;
  }

  @Selector([ScheduleListCalendarState])
  private static _dataServices(
    state: ScheduleListCalendarStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataServices;
  }

  @Selector([ScheduleListCalendarState])
  private static _dataCompanies(
    state: ScheduleListCalendarStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataCompanies;
  }

  @Selector([ScheduleListCalendarState])
  private static _filterStatuses(
    state: ScheduleListCalendarStateModel,
  ): number[] {
    return state.filterStatuses;
  }

  @Selector([ScheduleListCalendarState])
  private static _filterSites(state: ScheduleListCalendarStateModel): number[] {
    return state.filterSites;
  }

  @Selector([ScheduleListCalendarState])
  private static _filterServices(
    state: ScheduleListCalendarStateModel,
  ): number[] {
    return state.filterServices;
  }

  @Selector([ScheduleListCalendarState])
  private static _filterCompanies(
    state: ScheduleListCalendarStateModel,
  ): number[] {
    return state.filterCompanies;
  }

  @Selector([ScheduleListCalendarState])
  private static _calendarSchedule(
    state: ScheduleListCalendarStateModel,
  ): CalendarScheduleModel[] {
    return state.calendarSchedule;
  }
}
