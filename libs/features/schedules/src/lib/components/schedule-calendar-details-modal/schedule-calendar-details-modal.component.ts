import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import {
  ConfirmScheduleDetailsStoreService,
  SCHEDULE_STATUS_MAP,
  ScheduleCalendarActionLocationTypes,
  ScheduleCalendarActionStoreService,
  ScheduleStatus,
} from '@customer-portal/data-access/schedules';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { StatusComponent } from '@customer-portal/shared/components/grid';
import { CustomDatePipe } from '@customer-portal/shared/pipes/custom-date.pipe';

@Component({
  selector: 'lib-schedule-calendar-details-modal',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedButtonComponent,
    StatusComponent,
    CustomDatePipe,
  ],
  templateUrl: './schedule-calendar-details-modal.component.html',
  styleUrl: './schedule-calendar-details-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ConfirmScheduleDetailsStoreService,
    ScheduleCalendarActionStoreService,
  ],
})
export class ScheduleCalendarDetailsModalComponent implements OnInit {
  sharedButtonType = SharedButtonType;
  statusStatesMap = SCHEDULE_STATUS_MAP;
  isToBeConfirmedStatus = computed(() => {
    const { status } =
      this.confirmScheduleDetailsStoreService.calendarDetails();

    return (
      status.toLowerCase() === ScheduleStatus.ToBeConfirmedByDnv.toLowerCase()
    );
  });

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly scheduleCalendarActionStoreService: ScheduleCalendarActionStoreService,
    public readonly confirmScheduleDetailsStoreService: ConfirmScheduleDetailsStoreService,
  ) {}

  ngOnInit(): void {
    this.confirmScheduleDetailsStoreService.loadCalendarDetails(
      this.config.data.id,
      ScheduleCalendarActionLocationTypes.Calendar,
    );
  }

  onAddToCalendar(): void {
    this.scheduleCalendarActionStoreService.loadScheduleCalendarAddToCalendar(
      Number(this.config.data.id),
    );
  }

  onShareInvite(): void {
    this.scheduleCalendarActionStoreService.loadScheduleCalendarShareInvite(
      Number(this.config.data.id),
    );
  }
}
