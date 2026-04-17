import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { TranslocoDirective } from '@jsverse/transloco';
import { CalendarModule } from 'primeng/calendar';

import { OverviewUpcomingAuditStoreService } from '@customer-portal/data-access/overview';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';
import { CalendarViewType } from '@customer-portal/shared/models';

@Component({
  selector: 'lib-overview-upcoming-audits',
  imports: [
    CommonModule,
    SharedButtonComponent,
    TranslocoDirective,
    FormsModule,
    CalendarModule,
    FullCalendarModule,
  ],
  providers: [OverviewUpcomingAuditStoreService],
  templateUrl: './overview-upcoming-audits.component.html',
  styleUrl: './overview-upcoming-audits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewUpcomingAuditsComponent implements OnInit {
  visibleMonthDate?: Date;
  selectedYear!: number;
  selectedMonth!: number;
  sharedButtonType = SharedButtonType;
  calendarOptions = signal<CalendarOptions>({});

  constructor(
    private overviewUpcomingAuditStoreService: OverviewUpcomingAuditStoreService,
    private overviewSharedStoreService: OverviewSharedStoreService,
  ) {
    effect(() => {
      const events =
        this.overviewUpcomingAuditStoreService.overviewUpcomingAuditEvent();

      const eventDates = new Set(
        events.map((e) => new Date(e.start).toDateString()),
      );

      this.calendarOptions.update((prev) => ({
        ...prev,
        events,
        navLinkDayClick: (date) => {
          if (eventDates.has(date.toDateString())) {
            this.handleDateSelect(date);
          }
        },
      }));
    });
  }

  ngOnInit(): void {
    this.setCalendarOptions();
  }

  onButtonClick(): void {
    this.overviewSharedStoreService.setSelectedDate(
      this.visibleMonthDate,
      CalendarViewType.Year,
    );
  }

  private handleDatesSet = (viewInfo: DatesSetArg): void => {
    const { currentStart } = viewInfo.view;
    this.selectedYear = currentStart.getFullYear();
    this.selectedMonth = currentStart.getMonth() + 1;
    this.visibleMonthDate = new Date(this.selectedYear, this.selectedMonth);
    this.overviewUpcomingAuditStoreService.loadOverviewUpcomingAuditEvents(
      this.selectedMonth,
      this.selectedYear,
    );
  };

  private setCalendarOptions(): void {
    this.calendarOptions.set({
      headerToolbar: {
        start: 'prev',
        center: 'title',
        end: 'next',
      },
      buttonIcons: {
        prev: 'pi pi-angle-left',
        next: 'pi pi-angle-right',
      },
      plugins: [dayGridPlugin, multiMonthPlugin],
      initialView: CalendarViewType.Month,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      droppable: false,
      dayMaxEvents: false,
      height: 'auto',
      titleFormat: {
        month: 'short',
        year: 'numeric',
      },
      dayHeaderContent: (arg) => arg.text.substring(0, 2),
      events: [],
      navLinks: true,
      datesSet: this.handleDatesSet,
    });
  }

  private handleDateSelect(event: Date): void {
    this.overviewSharedStoreService.setSelectedDate(
      event,
      CalendarViewType.Month,
    );
  }
}
