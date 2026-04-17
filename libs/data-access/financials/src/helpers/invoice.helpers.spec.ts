import { InvoicesStatusStates } from '@customer-portal/shared';

import { isInvoiceOverdueOrUnpaid } from './invoice.helpers';

describe('isInvoiceOverdueOrUnpaid', () => {
  let invoice: any;

  beforeEach(() => {
    invoice = {
      invoiceId: '123',
      status: InvoicesStatusStates.Paid,
    };
  });

  test('should return true if the invoice status is "NotPaid"', () => {
    // Arrange
    invoice.status = InvoicesStatusStates.NotPaid;

    // Act
    const result = isInvoiceOverdueOrUnpaid(invoice);

    // Assert
    expect(result).toBe(true);
  });

  test('should return true if the invoice status is "Overdue"', () => {
    // Arrange
    invoice.status = InvoicesStatusStates.Overdue;

    // Act
    const result = isInvoiceOverdueOrUnpaid(invoice);

    // Assert
    expect(result).toBe(true);
  });

  test('should return false if the invoice status is "Paid"', () => {
    // Arrange
    invoice.status = InvoicesStatusStates.Paid;

    // Act
    const result = isInvoiceOverdueOrUnpaid(invoice);

    // Assert
    expect(result).toBe(false);
  });

  test('should return false if the invoice status is "Cancelled"', () => {
    // Arrange
    invoice.status = InvoicesStatusStates.Cancelled;

    // Act
    const result = isInvoiceOverdueOrUnpaid(invoice);

    // Assert
    expect(result).toBe(false);
  });
});
