import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs';

import {
  GlobalServiceMasterStoreService,
  GlobalSiteMasterStoreService,
} from '@customer-portal/data-access/global';
import { SharedSelectMultipleDatum } from '@customer-portal/shared/components/select/multiple';
import { throwIfNotSuccess } from '@customer-portal/shared/helpers/custom-operators';
import {
  CustomTreeNode,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared/models';

import { ScheduleCalendarFilterTypes, ScheduleStatusTypes } from '../constants';
import { ScheduleListItemEnrichedDto } from '../dtos';
import { CalendarScheduleModel } from '../models';
import {
  ScheduleListCalendarMapperService,
  ScheduleListService,
} from '../services';
import {
  LoadScheduleListAndCalendarFilters,
  LoadScheduleListAndCalendarFiltersError,
  LoadScheduleListAndCalendarFiltersOnDateChange,
  LoadScheduleListAndCalendarFiltersSuccess,
  LoadScheduleListCalendarSchedules,
  ResetScheduleListCalendarState,
  ResetScheduleListFilters,
  UpdateScheduleDateAndRecalculateSchedules,
  UpdateScheduleListCalendarFilterByKey,
  UpdateScheduleListCalendarFilterCompanies,
  UpdateScheduleListCalendarFilterServices,
  UpdateScheduleListCalendarFilterSites,
  UpdateScheduleListCalendarFilterStatuses,
  UpdateScheduleListCalendarScheduleMonth,
  UpdateScheduleListCalendarScheduleYear,
  UpdateScheduleStatusForReschedule,
  UpdateScheduleStatusToConfirmed,
} from './actions';

export interface ScheduleListCalendarStateModel {
  schedules: ScheduleListItemEnrichedDto[];
  allSchedules: ScheduleListItemEnrichedDto[];
  calendarSchedule: CalendarScheduleModel[];
  month: number;
  year: number;
  filterCompanies: number[];
  filterServices: number[];
  filterSites: number[];
  filterStatuses: number[];
  originalFilterCompanies: number[];
  originalFilterServices: number[];
  originalFilterSites: number[];
  originalFilterStatuses: number[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataSites: CustomTreeNode[];
  dataStatuses: SharedSelectMultipleDatum<number>[];
  isLoading: boolean;
  loaded: boolean;
  error: string | null;
}

const defaultState: ScheduleListCalendarStateModel = {
  schedules: [],
  allSchedules: [],
  calendarSchedule: [],
  month: 0,
  year: 0,
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  filterStatuses: [],
  originalFilterCompanies: [],
  originalFilterServices: [],
  originalFilterSites: [],
  originalFilterStatuses: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  dataStatuses: [],
  isLoading: false,
  loaded: false,
  error: null,
};

@State<ScheduleListCalendarStateModel>({
  name: 'scheduleListCalendar',
  defaults: defaultState,
})
@Injectable()
export class ScheduleListCalendarState {
  constructor(
    private scheduleListService: ScheduleListService,
    private globalSiteMasterStoreService: GlobalSiteMasterStoreService,
    private globalServiceMasterStoreService: GlobalServiceMasterStoreService,
  ) {}

  @Action(LoadScheduleListAndCalendarFilters)
  loadScheduleListAndCalendarFilters(
    ctx: StateContext<ScheduleListCalendarStateModel>,
  ) {
    const serviceMasterList =
      this.globalServiceMasterStoreService.serviceMasterList();
    const siteMasterList = this.globalSiteMasterStoreService.siteMasterList();
    ctx.patchState({
      isLoading: true,
      error: '',
    });

    return this.scheduleListService.getScheduleList().pipe(
      throwIfNotSuccess(),
      tap((scheduleListDto) => {
        const allScheduleItems = scheduleListDto?.data || [];
        const enrichedScheduleItems =
          ScheduleListCalendarMapperService.enrichScheduleItems(
            allScheduleItems,
            siteMasterList,
            serviceMasterList,
          );

        const {
          scheduleItems,
          dataCompanies,
          dataServices,
          dataSites,
          dataStatuses,
        } = ScheduleListCalendarMapperService.recalculateState(
          enrichedScheduleItems,
          [],
          [],
          [],
          [],
        );

        ctx.dispatch(
          new LoadScheduleListAndCalendarFiltersSuccess(
            scheduleItems,
            enrichedScheduleItems,
            dataCompanies,
            dataServices,
            dataSites,
            dataStatuses,
          ),
        );

        ctx.dispatch(new LoadScheduleListCalendarSchedules());
      }),
      catchError((err) =>
        ctx.dispatch(new LoadScheduleListAndCalendarFiltersError(err)),
      ),
    );
  }

  @Action(LoadScheduleListAndCalendarFiltersSuccess)
  loadScheduleListAndCalendarFiltersSuccess(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    action: LoadScheduleListAndCalendarFiltersSuccess,
  ) {
    ctx.patchState({
      schedules: action.schedules,
      allSchedules: action.allSchedules,
      dataCompanies: action.dataCompanies,
      dataServices: action.dataServices,
      dataSites: action.dataSites,
      dataStatuses: action.dataStatuses,
      isLoading: false,
      loaded: true,
      error: '',
    });
  }

  @Action(LoadScheduleListAndCalendarFiltersError)
  loadScheduleListAndCalendarFiltersError(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { error }: LoadScheduleListAndCalendarFiltersError,
  ) {
    ctx.patchState({
      isLoading: false,
      allSchedules: [],
      schedules: [],
      loaded: true,
      error: error?.message ?? 'Failed to load calendar schedule',
    });
  }

  @Action(UpdateScheduleDateAndRecalculateSchedules)
  updateScheduleDateAndRecalculateSchedules(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { year, month }: { year: number; month: number },
  ) {
    let state = ctx.getState();

    const existingFilterCompanies = state.filterCompanies ?? [];
    const existingFilterServices = state.filterServices ?? [];
    const existingFilterSites = state.filterSites ?? [];
    const existingFilterStatuses = state.filterStatuses ?? [];

    state = this.patchAndGetState(ctx, {
      year,
      month,
    });

    const { scheduleItems } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        existingFilterCompanies,
        existingFilterServices,
        existingFilterSites,
        existingFilterStatuses,
      );

    ctx.patchState({
      schedules: scheduleItems,
    });
  }

  @Action(ResetScheduleListCalendarState)
  resetScheduleListCalendarState(
    ctx: StateContext<ScheduleListCalendarStateModel>,
  ) {
    ctx.setState(defaultState);
  }

  @Action(ResetScheduleListFilters)
  resetScheduleListFilters(ctx: StateContext<ScheduleListCalendarStateModel>) {
    const state = ctx.getState();
    const {
      scheduleItems,
      dataCompanies,
      dataServices,
      dataSites,
      dataStatuses,
    } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      [],
      [],
      [],
      [],
    );

    ctx.patchState({
      filterCompanies: [],
      filterServices: [],
      filterSites: [],
      filterStatuses: [],
      dataCompanies,
      dataServices,
      dataSites,
      dataStatuses,
      schedules: scheduleItems,
      originalFilterCompanies: [],
      originalFilterServices: [],
      originalFilterSites: [],
      originalFilterStatuses: [],
    });

    ctx.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Action(LoadScheduleListAndCalendarFiltersOnDateChange)
  loadScheduleListAndCalendarFiltersOnDateChange(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { params }: LoadScheduleListAndCalendarFiltersOnDateChange,
  ) {
    const { month = 0, year = new Date().getFullYear() } = params ?? {};

    ctx.dispatch(new UpdateScheduleDateAndRecalculateSchedules(year, month));

    ctx.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Action(LoadScheduleListCalendarSchedules)
  loadScheduleListCalendarSchedules(
    ctx: StateContext<ScheduleListCalendarStateModel>,
  ) {
    const { schedules, month, year } = ctx.getState();

    const filteredSchedules = schedules.filter((item) =>
      ScheduleListCalendarMapperService.matchesScheduleDate(
        item.startDate,
        item.endDate,
        month,
        year,
      ),
    );

    const calendarSchedules =
      ScheduleListCalendarMapperService.mapToCalendarScheduleModel(
        filteredSchedules,
      );

    ctx.patchState({ calendarSchedule: calendarSchedules });
  }

  @Action(UpdateScheduleListCalendarScheduleMonth)
  updateScheduleListCalendarScheduleMonth(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { month }: UpdateScheduleListCalendarScheduleMonth,
  ) {
    ctx.patchState({ month });
  }

  @Action(UpdateScheduleListCalendarScheduleYear)
  updateScheduleListCalendarScheduleYear(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { year }: UpdateScheduleListCalendarScheduleYear,
  ) {
    ctx.patchState({ year });
  }

  @Action(UpdateScheduleListCalendarFilterByKey)
  updateScheduleListCalendarFilterByKey(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { data, key }: UpdateScheduleListCalendarFilterByKey,
  ) {
    const actionsMap = {
      [ScheduleCalendarFilterTypes.Companies]: [
        new UpdateScheduleListCalendarFilterCompanies(data as number[]),
      ],
      [ScheduleCalendarFilterTypes.Services]: [
        new UpdateScheduleListCalendarFilterServices(data as number[]),
      ],
      [ScheduleCalendarFilterTypes.Sites]: [
        new UpdateScheduleListCalendarFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
      [ScheduleCalendarFilterTypes.Statuses]: [
        new UpdateScheduleListCalendarFilterStatuses(data as number[]),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateScheduleListCalendarFilterCompanies)
  updateScheduleListCalendarFilterCompanies(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { data }: UpdateScheduleListCalendarFilterCompanies,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      filterCompanies: data,
      originalFilterCompanies: data,
    });

    const { dataServices } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      data,
      [],
      state.filterSites,
      state.filterStatuses,
    );

    const filterServices = this.prune(
      dataServices,
      state.originalFilterServices,
    );

    const { dataSites } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      data,
      filterServices,
      [],
      state.filterStatuses,
    );

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { dataStatuses } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      data,
      filterServices,
      filterSites,
      [],
    );

    const filterStatuses = this.prune(
      dataStatuses,
      state.originalFilterStatuses,
    );

    const { scheduleItems } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        data,
        filterServices,
        filterSites,
        filterStatuses,
      );

    ctx.patchState({
      dataServices,
      dataSites,
      dataStatuses,
      filterServices,
      filterSites,
      filterStatuses,
      schedules: scheduleItems,
    });

    ctx.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Action(UpdateScheduleListCalendarFilterServices)
  updateScheduleListCalendarFilterServices(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { data }: UpdateScheduleListCalendarFilterServices,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      originalFilterServices: data,
      filterServices: data,
    });

    const { dataCompanies } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        [],
        data,
        state.filterSites,
        state.filterStatuses,
      );

    const filterCompanies = this.prune(
      dataCompanies,
      state.originalFilterCompanies,
    );

    const { dataSites } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      filterCompanies,
      data,
      [],
      state.filterStatuses,
    );

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { dataStatuses } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      filterCompanies,
      data,
      filterSites,
      [],
    );

    const filterStatuses = this.prune(
      dataStatuses,
      state.originalFilterStatuses,
    );

    const { scheduleItems } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        filterCompanies,
        data,
        filterSites,
        filterStatuses,
      );

    ctx.patchState({
      dataCompanies,
      dataSites,
      dataStatuses,
      filterCompanies,
      filterSites,
      filterStatuses,
      schedules: scheduleItems,
    });

    ctx.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Action(UpdateScheduleListCalendarFilterSites)
  updateScheduleListCalendarFilterSites(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { data }: UpdateScheduleListCalendarFilterSites,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      originalFilterSites: data.filter as number[],
      filterSites: data.filter as number[],
    });

    const { dataCompanies } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        [],
        state.filterServices,
        data.filter as number[],
        state.filterStatuses,
      );

    const filterCompanies = this.prune(
      dataCompanies,
      state.originalFilterCompanies,
    );

    const { dataServices } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      filterCompanies,
      [],
      data.filter as number[],
      state.filterStatuses,
    );

    const filterServices = this.prune(
      dataServices,
      state.originalFilterServices,
    );

    const { dataStatuses } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      filterCompanies,
      filterServices,
      data.filter as number[],
      [],
    );

    const filterStatuses = this.prune(
      dataStatuses,
      state.originalFilterStatuses,
    );

    const { scheduleItems } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        filterCompanies,
        filterServices,
        data.filter as number[],
        filterStatuses,
      );

    ctx.patchState({
      dataCompanies,
      dataServices,
      dataStatuses,
      filterCompanies,
      filterServices,
      filterStatuses,
      schedules: scheduleItems,
    });

    ctx.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Action(UpdateScheduleListCalendarFilterStatuses)
  updateScheduleListCalendarFilterStatuses(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { data }: UpdateScheduleListCalendarFilterStatuses,
  ) {
    let state = ctx.getState();

    state = this.patchAndGetState(ctx, {
      originalFilterStatuses: data,
      filterStatuses: data,
    });

    const { dataCompanies } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        [],
        state.filterServices,
        state.filterSites,
        data,
      );

    const filterCompanies = this.prune(
      dataCompanies,
      state.originalFilterCompanies,
    );

    const { dataServices } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      filterCompanies,
      [],
      state.filterSites,
      data,
    );

    const filterServices = this.prune(
      dataServices,
      state.originalFilterServices,
    );

    const { dataSites } = ScheduleListCalendarMapperService.recalculateState(
      state.allSchedules,
      filterCompanies,
      filterServices,
      [],
      data,
    );

    const filterSites = this.pruneSiteFilter(
      dataSites,
      state.originalFilterSites,
    );

    const { scheduleItems } =
      ScheduleListCalendarMapperService.recalculateState(
        state.allSchedules,
        filterCompanies,
        filterServices,
        filterSites,
        data,
      );

    ctx.patchState({
      dataCompanies,
      dataServices,
      dataSites,
      filterCompanies,
      filterServices,
      filterSites,
      schedules: scheduleItems,
    });

    ctx.dispatch(new LoadScheduleListCalendarSchedules());
  }

  @Action(UpdateScheduleStatusToConfirmed)
  updateScheduleStatusToConfirmed(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { siteAuditId }: UpdateScheduleStatusToConfirmed,
  ) {
    const state = ctx.getState();

    const updatedAllSchedules = state.allSchedules.map((item) =>
      item.siteAuditId === siteAuditId
        ? { ...item, status: ScheduleStatusTypes.Confirmed }
        : item,
    );

    const updatedCalendarSchedule = state.calendarSchedule.map((item) =>
      item.siteAuditId === siteAuditId
        ? { ...item, status: ScheduleStatusTypes.Confirmed }
        : item,
    );

    ctx.patchState({
      allSchedules: updatedAllSchedules,
      calendarSchedule: updatedCalendarSchedule,
    });
  }

  @Action(UpdateScheduleStatusForReschedule)
  updateScheduleStatusForReschedule(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    { siteAuditId }: UpdateScheduleStatusForReschedule,
  ) {
    const state = ctx.getState();

    const updatedAllSchedules = state.allSchedules.map((item) =>
      item.siteAuditId === siteAuditId
        ? { ...item, status: ScheduleStatusTypes.ToBeConfirmedByDNV }
        : item,
    );

    const updatedCalendarSchedule = state.calendarSchedule.map((item) =>
      item.siteAuditId === siteAuditId
        ? { ...item, status: ScheduleStatusTypes.ToBeConfirmedByDNV }
        : item,
    );

    ctx.patchState({
      allSchedules: updatedAllSchedules,
      calendarSchedule: updatedCalendarSchedule,
    });
  }

  private prune<T>(data: { value: T }[], originalFilter: T[] = []): T[] {
    const available = data.map((d) => d.value);
    const filtered = (originalFilter || []).filter((f) =>
      available.includes(f),
    );

    return filtered;
  }

  private patchAndGetState(
    ctx: StateContext<ScheduleListCalendarStateModel>,
    patch: Partial<ScheduleListCalendarStateModel>,
  ): ScheduleListCalendarStateModel {
    ctx.patchState(patch);

    return ctx.getState();
  }

  private flattenTree(nodes: CustomTreeNode[]): CustomTreeNode[] {
    let all: CustomTreeNode[] = [];
    nodes.forEach((node) => {
      all.push(node);

      if (node.children && node.children.length > 0) {
        all = all.concat(this.flattenTree(node.children));
      }
    });

    return all;
  }

  private pruneSiteFilter(
    dataSites: CustomTreeNode[],
    filterSites: number[],
  ): number[] {
    const availableSiteIds = this.flattenTree(dataSites).map((s) => s.data);
    const filtered = (filterSites || []).filter((id) =>
      availableSiteIds.includes(id),
    );

    return filtered;
  }
}
