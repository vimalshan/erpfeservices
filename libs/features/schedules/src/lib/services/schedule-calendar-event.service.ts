import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { DateTime } from 'luxon';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, take } from 'rxjs';

import {
  ScheduleCalendarActionLocationTypes,
  ScheduleCalendarActionTypes,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';
import { ProfileStoreService } from '@customer-portal/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import { modalBreakpoints } from '@customer-portal/shared/constants';
import { formatUtcToLocal } from '@customer-portal/shared/helpers';

import {
  ScheduleCalendarConfirmModalComponent,
  ScheduleCalendarConfirmModalFooterComponent,
} from '../components/schedule-calendar-confirm-modal';
import {
  ScheduleCalendarDetailsModalComponent,
  ScheduleCalendarDetailsModalFooterComponent,
} from '../components/schedule-calendar-details-modal';
import {
  ScheduleCalendarRescheduleModalComponent,
  ScheduleCalendarRescheduleModalFooterComponent,
} from '../components/schedule-calendar-reschedule-modal';
import { SCHEDULE_LIST_SUPPORT } from '../constants';
import { RescheduleAction } from '../constants/schedule-list-reschedule.enum';
import { RequestChangesModel } from '../models';

const CommonDialogConfig = {
  width: '50vw',
  contentStyle: { overflow: 'auto', padding: '0' },
  breakpoints: modalBreakpoints,
  focusOnShow: false,
};

@Injectable({ providedIn: 'root' })
export class ScheduleCalendarEventService {
  private requestChangesCallback: ((id: number) => void) | null = null;

  constructor(
    private readonly profileStoreService: ProfileStoreService,
    private readonly dialogService: DialogService,
    private readonly ts: TranslocoService,
  ) {}

  onOpenDetailsModal(id: number, status: string, date: string): void {
    this.dialogService
      .open(ScheduleCalendarDetailsModalComponent, {
        ...CommonDialogConfig,
        header: this.ts.translate('schedules.details.title'),
        baseZIndex: 10000,
        data: {
          id,
        },
        templates: {
          footer: this.isDetailsModalFooterVisible(status, date)
            ? ScheduleCalendarDetailsModalFooterComponent
            : undefined,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((data: ScheduleCalendarActionTypes | RequestChangesModel) => {
        if (data === ScheduleCalendarActionTypes.Confirm) {
          this.onOpenConfirmModal(
            id,
            ScheduleCalendarActionLocationTypes.Calendar,
          );
        }

        if (data === ScheduleCalendarActionTypes.Reschedule) {
          const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const formattedStartDate = formatUtcToLocal(date, localZone);
          this.onOpenRescheduleModal(
            id,
            ScheduleCalendarActionLocationTypes.Calendar,
            formattedStartDate,
            status,
          );
        }

        if (
          typeof data === 'object' &&
          data.action === ScheduleCalendarActionTypes.RequestChanges
        ) {
          this.handleRequestChangesAction(data);
        }
      });
  }

  onOpenRescheduleModal(
    id: number,
    location: ScheduleCalendarActionLocationTypes,
    date: string,
    status: string,
  ): void {
    const rescheduleState = this.getRescheduleType(date, status);
    this.dialogService
      .open(ScheduleCalendarRescheduleModalComponent, {
        ...CommonDialogConfig,
        header: this.ts.translate('schedules.reschedule.title'),
        baseZIndex: 10000,
        data: {
          formValid: new BehaviorSubject(false),
          id,
          location,
          rescheduleState,
        },
        templates: {
          footer: ScheduleCalendarRescheduleModalFooterComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((result) => {
        this.handleRequestChangesAction(result);
      });
  }

  onOpenConfirmModal(
    id: number,
    location: ScheduleCalendarActionLocationTypes,
  ): void {
    this.dialogService
      .open(ScheduleCalendarConfirmModalComponent, {
        ...CommonDialogConfig,
        header: this.ts.translate('schedules.confirm.title'),
        baseZIndex: 10000,
        data: {
          id,
          location,
        },
        templates: {
          footer: ScheduleCalendarConfirmModalFooterComponent,
        },
      })
      .onClose.pipe(take(1))
      .subscribe((result) => {
        this.handleRequestChangesAction(result);
      });
  }

  registerRequestChangesCallback(callback: (id: number) => void): void {
    if (!this.requestChangesCallback) {
      this.requestChangesCallback = callback;
    }
  }

  getRescheduleType(date: string, status: string): string {
    const targetDateUtc = DateTime.fromFormat(date, 'dd-MM-yyyy', {
      zone: 'utc',
    }).startOf('day');
    const todayUtc = DateTime.now().setZone('utc').startOf('day');
    const diffInDays = targetDateUtc.diff(todayUtc, 'days').days;

    if (
      diffInDays > 0 &&
      diffInDays <= 30 &&
      status === ScheduleStatus.Confirmed
    ) {
      return RescheduleAction.SupportRequest;
    }

    return RescheduleAction.Reschedule;
  }

  unregisterRequestChangesCallback(): void {
    this.requestChangesCallback = null;
  }

  private isDetailsModalFooterVisible(status: string, date: string): boolean {
    return (
      (status === ScheduleStatus.Confirmed ||
        status === ScheduleStatus.ToBeConfirmed) &&
      new Date().getTime() < new Date(date).getTime() &&
      this.profileStoreService.hasPermission(
        PermissionCategories.Schedule,
        PermissionsList.Edit,
      )()
    );
  }

  private handleRequestChangesAction(result: RequestChangesModel): void {
    if (this.isRequestChangesAction(result) && this.requestChangesCallback) {
      this.requestChangesCallback(result.id);
    }
  }

  private isRequestChangesAction(
    value: RequestChangesModel | boolean,
  ): boolean {
    if (typeof value === 'boolean') {
      return false;
    }

    return (
      value.action === SCHEDULE_LIST_SUPPORT.RequestChanges ||
      value.action === ScheduleCalendarActionTypes.RequestChanges
    );
  }
}
