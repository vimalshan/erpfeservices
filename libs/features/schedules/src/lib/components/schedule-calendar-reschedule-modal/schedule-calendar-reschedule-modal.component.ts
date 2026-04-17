import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { DateTime } from 'luxon';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { filter, tap } from 'rxjs';

import {
  ConfirmScheduleDetailsStoreService,
  ScheduleCalendarActionStoreService,
} from '@customer-portal/data-access/schedules';
import { CURRENT_DATE_FORMAT } from '@customer-portal/shared/constants';
import { calculateWeekRange } from '@customer-portal/shared/helpers/date';
import { CustomDatePipe } from '@customer-portal/shared/pipes/custom-date.pipe';

import { RescheduleAction } from '../../constants/schedule-list-reschedule.enum';

@Component({
  selector: 'lib-schedule-calendar-reschedule-modal',
  imports: [
    CommonModule,
    TranslocoDirective,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    CustomDatePipe,
  ],
  templateUrl: './schedule-calendar-reschedule-modal.component.html',
  styleUrl: './schedule-calendar-reschedule-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DatePipe,
    ConfirmScheduleDetailsStoreService,
    ScheduleCalendarActionStoreService,
  ],
})
export class ScheduleCalendarRescheduleModalComponent implements OnInit {
  public calendarDefaultDate!: Date;
  public calendarMinDate: Date = new Date();
  public form!: FormGroup;
  public rescheduleState!: RescheduleAction;

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly datePipe: DatePipe,
    private readonly destroyRef: DestroyRef,
    private readonly ref: DynamicDialogRef,
    private readonly fb: FormBuilder,
    public readonly confirmScheduleDetailsStoreService: ConfirmScheduleDetailsStoreService,
    public readonly scheduleCalendarActionStoreService: ScheduleCalendarActionStoreService,
  ) {}

  ngOnInit(): void {
    this.confirmScheduleDetailsStoreService.loadCalendarDetails(
      this.config.data.id,
      this.config.data.location,
    );
    this.rescheduleState = this.config.data.rescheduleState;
    this.scheduleCalendarActionStoreService.loadScheduleCalendarRescheduleReasons();
    this.setFormGroup();
    this.setFormObs();
    this.setRefObs();
    this.setCalendarDefaultDate();
  }

  setFormGroup(): void {
    this.form = this.getFormGroup();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  setRefObs(): void {
    this.ref.onClose
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((result): result is boolean => typeof result === 'boolean'),
      )
      .subscribe((isSubmitted) => {
        if (isSubmitted) {
          this.onSubmit();
        }
      });
  }

  setFormObs(): void {
    this.form.valueChanges
      .pipe(
        tap(() => this.config.data.formValid.next(this.form.valid)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  setCalendarDefaultDate(): void {
    this.calendarDefaultDate = DateTime.fromFormat(
      this.confirmScheduleDetailsStoreService.calendarDetails().startDate,
      CURRENT_DATE_FORMAT,
      { zone: 'utc' },
    ).toJSDate();
  }

  getFormGroup(): FormGroup {
    return this.fb.group({
      additionalComments: [''],
      rescheduleDate: ['', Validators.required],
      rescheduleReason: ['', Validators.required],
      siteAuditId: [this.config.data.id, Validators.required],
      weekNumber: [0],
      weekRange: [null],
    });
  }

  getOverlayOptions(): OverlayOptions {
    return {
      listener: (_: Event, options?: OverlayListenerOptions) => {
        if (options?.type === 'scroll') {
          return false;
        }

        return options?.valid;
      },
    };
  }

  onSelectDate(date: Date): void {
    const weekNumber = `${this.datePipe.transform(date, 'w')}/${new Date().getUTCFullYear()}`;
    const weekRange = calculateWeekRange(date);

    this.form.controls['rescheduleDate'].patchValue(date);
    this.form.controls['weekNumber'].patchValue(weekNumber);
    this.form.controls['weekRange'].patchValue(weekRange);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const {
        additionalComments,
        rescheduleDate,
        rescheduleReason,
        siteAuditId,
        weekNumber,
      } = this.form.value;

      this.scheduleCalendarActionStoreService.updateScheduleCalendarReschedule(
        additionalComments,
        rescheduleDate,
        rescheduleReason,
        siteAuditId,
        weekNumber,
      );
    }
  }
}
