import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CalendarModule, CalendarTypeView } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

import {
  InvoiceListItemModel,
  InvoiceListStoreService,
} from '@customer-portal/data-access/financials';
import { getDateWithoutTimezone } from '@customer-portal/shared/helpers/date';

@Component({
  selector: 'lib-update-planned-payment-date',
  imports: [
    CommonModule,
    TranslocoDirective,
    CalendarModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
  ],
  templateUrl: './update-planned-payment-date.component.html',
  styleUrl: './update-planned-payment-date.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePlannedPaymentDateComponent implements OnInit, OnDestroy {
  private invoiceIds!: string[];

  invoices!: Signal<InvoiceListItemModel[]>;
  date?: Date | undefined;
  viewMode: CalendarTypeView = 'date';
  minimumDate = new Date();

  constructor(
    private config: DynamicDialogConfig,
    private invoiceListStoreService: InvoiceListStoreService,
  ) {
    this.invoiceIds = this.config.data.invoiceIds;
  }

  ngOnInit(): void {
    this.invoices = this.invoiceListStoreService.getInvoicesByIds(
      this.invoiceIds,
    );
  }

  checkResponses(): void {
    this.invoiceListStoreService.switchCanUploadData(!!this.date);
  }

  ngOnDestroy(): void {
    this.invoiceListStoreService.switchCanUploadData(false);
  }

  onSelectDate(date: Date): void {
    this.config.data.date = getDateWithoutTimezone(date);
  }
}
