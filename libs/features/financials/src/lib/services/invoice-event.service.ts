import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { modalBreakpoints } from '@customer-portal/shared';

import { UpdatePlannedPaymentDateComponent } from '../components/update-planned-payment-date';
import { UpdatePlannedPaymentDateFooterComponent } from '../components/update-planned-payment-date-footer';

@Injectable({ providedIn: 'root' })
export class InvoiceEventService {
  ref: DynamicDialogRef | undefined;

  constructor(
    private dialogService: DialogService,
    private ts: TranslocoService,
  ) {}

  updateReferenceNumber(_id: number | string): void {}

  openUpdatePaymentDateModal(ids: (number | string)[]): void {
    this.ref = this.dialogService.open(UpdatePlannedPaymentDateComponent, {
      header: this.ts.translate('invoices.updatePlannedPaymentDate.header'),
      width: '50vw',
      contentStyle: { overflow: 'auto', padding: '0' },
      breakpoints: modalBreakpoints,
      data: {
        invoiceIds: ids,
      },
      focusOnShow: false,
      templates: {
        footer: UpdatePlannedPaymentDateFooterComponent,
      },
    });
  }
}
