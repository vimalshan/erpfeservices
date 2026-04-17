import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import {
  CustomTreeNode,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { ScheduleCalendarFilterKey } from '../../models';
import { CalendarScheduleModel } from '../../models/calendar-schedule.model';
import {
  LoadScheduleListAndCalendarFilters,
  LoadScheduleListAndCalendarFiltersOnDateChange,
  LoadScheduleListCalendarSchedules,
  ResetScheduleListCalendarState,
  ResetScheduleListFilters,
  UpdateScheduleListCalendarFilterByKey,
  UpdateScheduleListCalendarFilterCompanies,
  UpdateScheduleListCalendarFilterServices,
  UpdateScheduleListCalendarFilterSites,
  UpdateScheduleListCalendarFilterStatuses,
  UpdateScheduleListCalendarScheduleMonth,
  UpdateScheduleListCalendarScheduleYear,
  UpdateScheduleStatusForReschedule,
  UpdateScheduleStatusToConfirmed,
} from '../actions';
import { ScheduleListCalendarSelectors } from '../selectors/schedule-list-calendar.selectors';

@Injectable()
export class ScheduleListCalendarStoreService {
  constructor(private store: Store) {}

  get calendarSchedule(): Signal<CalendarScheduleModel[]> {
    return this.store.selectSignal(
      ScheduleListCalendarSelectors.calendarSchedule,
    );
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(
      ScheduleListCalendarSelectors.filterCompanies,
    );
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(
      ScheduleListCalendarSelectors.filterServices,
    );
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.filterSites);
  }

  get filterSites$(): Observable<number[]> {
    return this.store.select(ScheduleListCalendarSelectors.filterSites);
  }

  get filterStatuses(): Signal<number[]> {
    return this.store.selectSignal(
      ScheduleListCalendarSelectors.filterStatuses,
    );
  }

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.dataServices);
  }

  get dataSites(): Signal<CustomTreeNode[]> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.dataSites);
  }

  get dataStatuses(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.dataStatuses);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.isLoading);
  }

  get loaded(): Signal<boolean> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.loaded);
  }

  get loaded$(): Observable<boolean> {
    return this.store.select(ScheduleListCalendarSelectors.loaded);
  }

  get error(): Signal<string | null> {
    return this.store.selectSignal(ScheduleListCalendarSelectors.error);
  }

  get dataSites$(): Observable<CustomTreeNode[]> {
    return this.store.select(ScheduleListCalendarSelectors.dataSites);
  }

  @Dispatch()
  loadScheduleListAndCalendarFilters() {
    return this.store.dispatch(new LoadScheduleListAndCalendarFilters());
  }

  @Dispatch()
  loadScheduleListAndCalendarFiltersOnDateChange(params?: any) {
    return this.store.dispatch(
      new LoadScheduleListAndCalendarFiltersOnDateChange(params),
    );
  }

  @Dispatch()
  loadScheduleListCalendarSchedules() {
    return this.store.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Dispatch()
  updateScheduleListCalendarScheduleMonth(month: number) {
    return this.store.dispatch(
      new UpdateScheduleListCalendarScheduleMonth(month),
    );
  }

  @Dispatch()
  updateScheduleListCalendarScheduleYear(year: number) {
    return this.store.dispatch(
      new UpdateScheduleListCalendarScheduleYear(year),
    );
  }

  @Dispatch()
  updateScheduleListCalendarFilterByKey = (
    data: unknown,
    key: ScheduleCalendarFilterKey,
  ) => new UpdateScheduleListCalendarFilterByKey(data, key);

  @Dispatch()
  resetScheduleListFilters() {
    return this.store.dispatch(new ResetScheduleListFilters());
  }

  @Dispatch()
  updateScheduleListCalendarFilterCompanies = (data: number[]) =>
    new UpdateScheduleListCalendarFilterCompanies(data);

  @Dispatch()
  updateScheduleListCalendarFilterServices = (data: number[]) =>
    new UpdateScheduleListCalendarFilterServices(data);

  @Dispatch()
  updateScheduleListCalendarFilterSites = (
    data: SharedSelectTreeChangeEventOutput,
  ) => new UpdateScheduleListCalendarFilterSites(data);

  @Dispatch()
  updateScheduleListCalendarFilterStatuses = (data: number[]) =>
    new UpdateScheduleListCalendarFilterStatuses(data);

  @Dispatch()
  updateScheduleStatusToConfirmed(siteAuditId: number) {
    return this.store.dispatch(
      new UpdateScheduleStatusToConfirmed(siteAuditId),
    );
  }

  @Dispatch()
  updateScheduleStatusForReschedule(siteAuditId: number) {
    return this.store.dispatch(
      new UpdateScheduleStatusForReschedule(siteAuditId),
    );
  }

  @Dispatch()
  resetScheduleListCalendarState = () => new ResetScheduleListCalendarState();
}
