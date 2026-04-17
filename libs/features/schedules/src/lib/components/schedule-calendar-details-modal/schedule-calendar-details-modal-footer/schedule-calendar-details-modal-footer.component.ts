import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionTypes,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

import { RequestChangesModel } from '../../../models';

@Component({
  selector: 'lib-schedule-calendar-details-modal-footer',
  imports: [CommonModule, TranslocoDirective, SharedButtonComponent],
  templateUrl: './schedule-calendar-details-modal-footer.component.html',
  styleUrl: './schedule-calendar-details-modal-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmScheduleDetailsStoreService],
})
export class ScheduleCalendarDetailsModalFooterComponent {
  public isConfirmVisible = computed(
    () =>
      this.confirmScheduleDetailsStoreService.calendarDetails().status ===
      ScheduleStatus.ToBeConfirmed,
  );
  public isRescheduleVisible = computed(
    () =>
      this.confirmScheduleDetailsStoreService.calendarDetails().status ===
      ScheduleStatus.ToBeConfirmed,
  );
  public sharedButtonType = SharedButtonType;

  public isDnvUser = computed(() =>
    this.settingsCoBrowsingStoreService.isDnvUser(),
  );

  constructor(
    private readonly confirmScheduleDetailsStoreService: ConfirmScheduleDetailsStoreService,
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {}

  onConfirm(): void {
    this.ref.close(ScheduleCalendarActionTypes.Confirm);
  }

  onReschedule(): void {
    this.ref.close(ScheduleCalendarActionTypes.Reschedule);
  }

  onRequestChanges(): void {
    const requestChanges: RequestChangesModel = {
      action: ScheduleCalendarActionTypes.RequestChanges,
      id: this.config.data.id.toString(),
    };
    this.ref.close(requestChanges);
  }
}
