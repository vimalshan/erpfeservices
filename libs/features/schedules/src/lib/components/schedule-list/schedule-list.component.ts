import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ofActionSuccessful } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, tap } from 'rxjs';

import {
  LoggingService,
  ScheduleParams,
  ServiceNowService,
} from '@customer-portal/core';
import {
  ConfirmScheduleDetailsStoreService,
  SCHEDULE_STATUS_MAP,
  ScheduleCalendarActionLocationTypes,
  ScheduleCalendarActionStoreService,
  ScheduleListStoreService,
  UpdateScheduleCalendarConfirmSuccess,
  UpdateScheduleCalendarRescheduleSuccess,
} from '@customer-portal/data-access/schedules';
import {
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  getToastContentBySeverity,
  GridComponent,
  GridConfig,
  GridEventAction,
  GridEventActionType,
  ObjectName,
  ObjectType,
  PageName,
  ToastSeverity,
} from '@customer-portal/shared';

import { SCHEDULES_LIST_COLUMNS } from '../../constants';
import { ScheduleCalendarEventService } from '../../services';

@Component({
  selector: 'lib-schedule-list',
  imports: [CommonModule, TranslocoDirective, GridComponent],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss',
  providers: [
    DialogService,
    ConfirmScheduleDetailsStoreService,
    ScheduleCalendarActionStoreService,
    ScheduleListStoreService,
    ScheduleCalendarEventService,
  ],
})
export class ScheduleListComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  statusMap = SCHEDULE_STATUS_MAP;
  cols: ColumnDefinition[] = SCHEDULES_LIST_COLUMNS;
  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.scheduleListStoreService.loadScheduleList();
    }),
  );

  constructor(
    private readonly scheduleCalendarActionStoreService: ScheduleCalendarActionStoreService,
    private readonly scheduleCalendarEventService: ScheduleCalendarEventService,
    public readonly scheduleListStoreService: ScheduleListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private ts: TranslocoService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
    private profileLanguageStoreService: ProfileLanguageStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.ScheduleList,
      ObjectName.Schedules,
      ObjectType.Grid,
    );

    this.setActionsObs();
    this.registerSupportCallBack();
  }

  setActionsObs(): void {
    this.actions$
      .pipe(
        ofActionSuccessful(
          UpdateScheduleCalendarConfirmSuccess,
          UpdateScheduleCalendarRescheduleSuccess,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.scheduleListStoreService.loadScheduleList();
      });
  }

  registerSupportCallBack(): void {
    this.scheduleCalendarEventService.registerRequestChangesCallback(
      (id: number) => this.openScheduleServiceNowSupport(id),
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.scheduleListStoreService.updateGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    this.scheduleListStoreService.exportAuditSchedulesExcel();
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  triggerEventAction({ event }: { event: GridEventAction }): void {
    const { id, actionType } = event;
    const actionHashMap: Partial<Record<GridEventActionType, () => void>> = {
      [GridEventActionType.AddToCalendar]: () =>
        this.scheduleCalendarActionStoreService.loadScheduleCalendarAddToCalendar(
          Number(id),
        ),
      [GridEventActionType.ShareInvite]: () =>
        this.scheduleCalendarActionStoreService.loadScheduleCalendarShareInvite(
          Number(id),
        ),
      [GridEventActionType.Reschedule]: () =>
        this.scheduleCalendarEventService.onOpenRescheduleModal(
          Number(id),
          ScheduleCalendarActionLocationTypes.List, '', ''
        ),
      [GridEventActionType.Confirm]: () =>
        this.scheduleCalendarEventService.onOpenConfirmModal(
          Number(id),
          ScheduleCalendarActionLocationTypes.List,
        ),
      [GridEventActionType.RequestChanges]: () =>
        this.openScheduleServiceNowSupport(id),
    };

    const actionFn = actionHashMap[actionType];

    if (actionFn) {
      actionFn();
    } else {
      throw new Error(
        `Unknown action type in schedule list actions menu : ${actionType}`,
      );
    }
  }

  ngOnDestroy(): void {
    this.scheduleListStoreService.resetScheduleListState();
  }

  private openScheduleServiceNowSupport(scheduleId: number | string): void {
    try {
      const schedule = this.scheduleListStoreService
        .schedules()
        .find((x) => x.scheduleId === scheduleId);

      if (!schedule) {
        throw new Error(`Schedule with ID ${scheduleId} not found`);
      }

      const scheduleServiceNowParams: ScheduleParams = {
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        auditID: schedule.auditID,
        siteAuditID: schedule.siteAuditId,
        site: schedule.site,
        status: schedule.status,
        siteAddress: schedule.siteAddress,
        siteCity: schedule.city,
        siteZip: schedule.siteZip,
        siteCountry: schedule.siteCountry,
        siteState: schedule.siteState,
        reportingCountry: schedule.reportingCountry,
        projectNumber: schedule.projectNumber,
        language: this.profileLanguageStoreService.languageLabel(),
        service: schedule.service,
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
