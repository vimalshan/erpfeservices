import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { InvoiceListStoreService } from '@customer-portal/data-access/financials';
import {
  SharedButtonComponent,
  SharedButtonType,
} from '@customer-portal/shared/components/button';

@Component({
  selector: 'lib-update-planned-payment-date-footer',
  imports: [CommonModule, TranslocoDirective, SharedButtonComponent],
  templateUrl: './update-planned-payment-date-footer.component.html',
  styleUrl: './update-planned-payment-date-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePlannedPaymentDateFooterComponent {
  canUploadData: Signal<boolean>;
  sharedButtonType = SharedButtonType;
  invoicesId: string[];

  constructor(
    private ref: DynamicDialogRef,
    private invoiceListStoreService: InvoiceListStoreService,
    private config: DynamicDialogConfig,
  ) {
    this.canUploadData = this.invoiceListStoreService.canUploadData;
    this.invoicesId = this.config.data.invoiceIds;
  }

  closeDialog(data: boolean): void {
    this.ref.close(data);
  }

  onClickUpdatePlannedPaymentDate(): void {
    const newDate = this.config.data.date;
    const isSuccessful = this.invoiceListStoreService.updatePlannedPaymentDate(
      this.invoicesId,
      newDate,
    );
    this.ref.close(isSuccessful);
  }
}
