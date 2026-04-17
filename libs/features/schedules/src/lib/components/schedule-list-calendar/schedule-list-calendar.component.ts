import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { combineLatest, filter } from 'rxjs';

import {
  LoggingService,
  ScheduleParams,
  ServiceNowService,
} from '@customer-portal/core';
import {
  SCHEDULE_STATUS_MAP,
  ScheduleCalendarFilterKey,
  ScheduleCalendarFilterTypes,
  ScheduleListCalendarStoreService,
} from '@customer-portal/data-access/schedules';
import { ProfileLanguageStoreService } from '@customer-portal/data-access/settings';
import { environment } from '@customer-portal/environments';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import {
  CustomFullCalendarComponent,
  NoDataComponent,
  SharedButtonComponent,
  SharedButtonType,
  SharedSelectMultipleModComponent,
  TreeDropdownComponent,
} from '@customer-portal/shared/components';
import { getToastContentBySeverity } from '@customer-portal/shared/helpers/custom-toast';
import { formatUtcToLocal } from '@customer-portal/shared/helpers/date';
import {
  CalendarViewType,
  CustomTreeNode,
  ToastSeverity,
} from '@customer-portal/shared/models';

import { RescheduleAction } from '../../constants/schedule-list-reschedule.enum';
import { ScheduleCalendarEventService } from '../../services/schedule-calendar-event.service';

@Component({
  selector: 'lib-schedule-list-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleModComponent,
    SharedButtonComponent,
    TreeDropdownComponent,
    CustomFullCalendarComponent,
    NoDataComponent,
  ],
  templateUrl: './schedule-list-calendar.component.html',
  styleUrls: ['./schedule-list-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ScheduleListCalendarComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  public readonly scheduleStatusMap = SCHEDULE_STATUS_MAP;
  public readonly calendarViewType = computed(() =>
    this.overviewSharedStoreService.overviewUpcomingAuditSelectedDate()
      ? this.overviewUpcomingAuditViewType(
          this.overviewSharedStoreService.overviewUpcomingAuditSelectDateViewType(),
        )
      : CalendarViewType.Year,
  );
  public isScheduleInitialized = signal(false);

  public filterTypes = ScheduleCalendarFilterTypes;

  sharedButtonType = SharedButtonType;

  siteData: CustomTreeNode[] = [];
  latestExpandedState = new Map<string, boolean>();
  filterSites: number[] = [];
  globalSelectedIds = new Set<number>();

  constructor(
    public scheduleListCalendarStoreService: ScheduleListCalendarStoreService,
    protected readonly overviewSharedStoreService: OverviewSharedStoreService,
    private scheduleCalendarEventService: ScheduleCalendarEventService,
    private serviceNowService: ServiceNowService,
    private loggingService: LoggingService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
    private ts: TranslocoService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.scheduleListCalendarStoreService.loadScheduleListAndCalendarFilters();
    this.handleSiteInitialization();

    if (this.isAuditsWidgetNavigation()) {
      this.isScheduleInitialized.set(true);
    } else {
      this.waitForScheduleStoreLoad();
    }
    this.registerSupportCallBack();
  }

  ngOnDestroy(): void {
    this.scheduleCalendarEventService.unregisterRequestChangesCallback();
    this.overviewSharedStoreService.resetOverviewSharedState();
    this.scheduleListCalendarStoreService.resetScheduleListCalendarState();
  }

  onFilterChange(data: unknown, key: ScheduleCalendarFilterKey): void {
    this.scheduleListCalendarStoreService.updateScheduleListCalendarFilterByKey(
      data,
      key,
    );
  }

  onReset(): void {
    this.latestExpandedState = new Map();
    this.filterSites = [];
    this.globalSelectedIds.clear();

    this.scheduleListCalendarStoreService.resetScheduleListFilters();

    this.cdr.markForCheck();
  }

  onExpandedStateChange(map: Map<string, boolean>) {
    this.latestExpandedState = map;
  }

  onSelectionChange(event: {
    changedNode?: CustomTreeNode;
    checked?: boolean;
    selectAll?: boolean;
  }) {
    if (event.selectAll !== undefined) {
      this.handleSelectAll(event.selectAll);
    } else if (event.changedNode) {
      this.handleNodeSelection(event.changedNode, event.checked ?? false);
    }

    const selectedSiteIds = Array.from(this.globalSelectedIds);
    this.onFilterChange({ filter: selectedSiteIds }, this.filterTypes.Sites);
  }

  onClickEvent({
    id,
    status,
    date,
  }: {
    id: number;
    status: string;
    date: string;
  }): void {
    this.scheduleCalendarEventService.onOpenDetailsModal(
      Number(id),
      status,
      date,
    );
  }

  onChangeDate({ currentMonth, currentYear }: Record<string, number>): void {
    this.scheduleListCalendarStoreService.loadScheduleListAndCalendarFiltersOnDateChange(
      {
        month: currentMonth,
        year: currentYear,
      },
    );
  }

  private overviewUpcomingAuditViewType(viewType: string) {
    return viewType.includes(CalendarViewType.Month)
      ? CalendarViewType.Month
      : CalendarViewType.Year;
  }

  private waitForScheduleStoreLoad() {
    this.scheduleListCalendarStoreService.loaded$
      .pipe(
        filter((storeLoaded) => storeLoaded),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.isScheduleInitialized.set(true);
      });
  }

  private isAuditsWidgetNavigation(): boolean {
    return !!this.overviewSharedStoreService.overviewUpcomingAuditSelectedDate();
  }

  private handleSiteInitialization() {
    combineLatest([
      this.scheduleListCalendarStoreService.dataSites$,
      this.scheduleListCalendarStoreService.filterSites$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([dataSites, filterSites]) => {
        this.siteData = dataSites;
        this.filterSites = filterSites;
        this.cdr.markForCheck();
      });
  }

  private handleSelectAll(selectAll: boolean) {
    if (selectAll) {
      this.globalSelectedIds = new Set(this.getAllSiteIds(this.siteData));
    } else {
      this.globalSelectedIds.clear();
    }
  }

  private handleNodeSelection(node: CustomTreeNode, checked: boolean) {
    if (node.children && node.children.length > 0) {
      const descendantIds = this.getAllDescendantLeafIds(node);
      descendantIds.forEach((id) =>
        checked
          ? this.globalSelectedIds.add(id)
          : this.globalSelectedIds.delete(id),
      );
    } else {
      if (checked) {
        this.globalSelectedIds.add(node.data);
      }

      if (!checked) {
        this.globalSelectedIds.delete(node.data);
      }
    }
  }

  private getAllDescendantLeafIds(node: CustomTreeNode): number[] {
    if (!node.children || node.children.length === 0) {
      return [node.data];
    }

    return node.children.flatMap((child) =>
      this.getAllDescendantLeafIds(child),
    );
  }

  private getAllSiteIds(nodes: CustomTreeNode[]): number[] {
    return nodes.flatMap((node) => this.getAllDescendantLeafIds(node));
  }

  private registerSupportCallBack(): void {
    this.scheduleCalendarEventService.registerRequestChangesCallback(
      (id: number | string) => this.openScheduleCalendarServiceNowSupport(id),
    );
  }

  private openScheduleCalendarServiceNowSupport(
    scheduleId: number | string,
  ): void {
    try {
      const scheduleIdStr =
        typeof scheduleId === 'number' ? scheduleId.toString() : scheduleId;
      const schedule = this.scheduleListCalendarStoreService
        .calendarSchedule()
        .find((x) => x.scheduleId === scheduleIdStr);

      if (!schedule) {
        throw new Error(`Schedule with ID ${scheduleId} not found`);
      }
      const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formattedStartDate = formatUtcToLocal(
        schedule.startDate,
        localZone,
      );

      const rescheduleState =
        this.scheduleCalendarEventService.getRescheduleType(
          formattedStartDate ?? '',
          schedule.status,
        );

      const dynamicSysId =
        rescheduleState === RescheduleAction.SupportRequest
          ? environment.serviceNow.sysIds.dnvReschedule
          : environment.serviceNow.sysIds.dnvSchedule;
      const scheduleServiceNowParams: ScheduleParams = {
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        auditID: schedule.auditID,
        siteAuditID: schedule.siteAuditId,
        site: schedule.site,
        status: schedule.status,
        service: schedule.service,
        siteAddress: schedule.siteAddress,
        siteCity: schedule.city,
        siteZip: schedule.siteZip.toString(),
        siteCountry: schedule.siteCountry,
        siteState: schedule.siteState,
        reportingCountry: schedule.reportingCountry,
        projectNumber: schedule.projectNumber,
        language: this.profileLanguageStoreService.languageLabel(),
        sys_id: dynamicSysId,
        accountDNVId: schedule.accountDNVId,
      };

      this.serviceNowService.openScheduleSupport(scheduleServiceNowParams);
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
