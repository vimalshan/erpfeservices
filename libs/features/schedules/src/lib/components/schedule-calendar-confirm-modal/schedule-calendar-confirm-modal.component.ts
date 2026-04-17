import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter } from 'rxjs/operators';

import {
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionStoreService,
} from '@customer-portal/data-access/schedules';

@Component({
  selector: 'lib-schedule-calendar-confirm-modal',
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './schedule-calendar-confirm-modal.component.html',
  styleUrl: './schedule-calendar-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ConfirmScheduleDetailsStoreService,
    ScheduleCalendarActionStoreService,
  ],
})
export class ScheduleCalendarConfirmModalComponent implements OnInit {
  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly destroyRef: DestroyRef,
    private readonly ref: DynamicDialogRef,
    private readonly scheduleCalendarActionStoreService: ScheduleCalendarActionStoreService,
    public readonly confirmScheduleDetailsStoreService: ConfirmScheduleDetailsStoreService,
  ) {}

  ngOnInit(): void {
    this.confirmScheduleDetailsStoreService.loadCalendarDetails(
      this.config.data.id,
      this.config.data.location,
    );
    this.setRefObs();
  }

  setRefObs(): void {
    this.ref.onClose
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((result): result is boolean => typeof result === 'boolean'),
      )
      .subscribe((isSubmitted) => {
        if (isSubmitted) {
          this.onConfirm();
        }
      });
  }

  onConfirm(): void {
    this.scheduleCalendarActionStoreService.updateScheduleCalendarConfirm(
      this.config.data.id,
    );
  }
}
