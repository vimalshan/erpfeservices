import { InvoicesStatusStates } from '@customer-portal/shared';

import { InvoiceListItemDto } from '../dtos';
import { InvoiceListItemModel } from '../models';

export const isInvoiceOverdueOrUnpaid = (
  invoice: InvoiceListItemDto | InvoiceListItemModel,
): boolean => {
  const statuses = [
    InvoicesStatusStates.NotPaid,
    InvoicesStatusStates.Overdue,
    InvoicesStatusStates.PartiallyPaid,
  ];

  return statuses.includes(invoice.status as InvoicesStatusStates);
};
