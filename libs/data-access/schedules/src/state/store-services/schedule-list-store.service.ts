import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import {
  FilteringConfig,
  FilterOptions,
  GridConfig,
} from '@customer-portal/shared';

import { ScheduleListItemModel } from '../../models';
import {
  ApplyNavigationFiltersFromOverview,
  ExportSchedulesExcel,
  LoadScheduleList,
  ResetScheduleListState,
  UpdateGridConfig,
  UpdateScheduleListForReschedule,
  UpdateScheduleListStatusToConfirmed,
} from '../actions';
import { ScheduleListSelectors } from '../selectors/schedule-list.selectors';

@Injectable()
export class ScheduleListStoreService {
  constructor(private store: Store) {}

  get schedules(): Signal<ScheduleListItemModel[]> {
    return this.store.selectSignal(ScheduleListSelectors.schedules);
  }

  get schedulesList(): Signal<ScheduleListItemModel[]> {
    return this.store.selectSignal(ScheduleListSelectors.allSchedulesList);
  }

  get totalRecords(): Signal<number> {
    return this.store.selectSignal(ScheduleListSelectors.totalFilteredRecords);
  }

  get hasActiveFilters(): Signal<boolean> {
    return this.store.selectSignal(ScheduleListSelectors.hasActiveFilters);
  }

  get filterOptions(): Signal<FilterOptions> {
    return this.store.selectSignal(ScheduleListSelectors.filterOptions);
  }

  get filteringConfig(): Observable<FilteringConfig> {
    return this.store.select(ScheduleListSelectors.filteringConfig);
  }

  get filteringConfigSignal(): Signal<FilteringConfig> {
    return this.store.selectSignal(ScheduleListSelectors.filteringConfig);
  }

  get isLoading(): Signal<boolean> {
    return this.store.selectSignal(ScheduleListSelectors.isLoading);
  }

  @Dispatch()
  loadScheduleList = () => new LoadScheduleList();

  @Dispatch()
  updateGridConfig = (gridConfig: GridConfig) =>
    new UpdateGridConfig(gridConfig);

  @Dispatch()
  resetScheduleListState = () => new ResetScheduleListState();

  @Dispatch()
  exportAuditSchedulesExcel = () => new ExportSchedulesExcel();

  @Dispatch()
  updateScheduleListStatusToConfirmed(siteAuditId: number) {
    return this.store.dispatch(
      new UpdateScheduleListStatusToConfirmed(siteAuditId),
    );
  }

  @Dispatch()
  updateScheduleListForReschedule(siteAuditId: number) {
    return this.store.dispatch(
      new UpdateScheduleListForReschedule(siteAuditId),
    );
  }

  @Dispatch()
  applyNavigationFiltersFromOverview = () =>
    new ApplyNavigationFiltersFromOverview();
}
