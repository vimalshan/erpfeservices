import {
  FilteringConfig,
  FilterMode,
  FilterOperator,
} from '@customer-portal/shared';

import { InvoiceListMapperService } from './invoice-list-mapper.service';

describe('InvoiceListMapperService', () => {
  describe('mapToInvoiceExcelPayloadDto', () => {
    test('should map filterConfig to InvoiceExcelPayloadDto correctly', () => {
      // Arrange
      const filterConfig: FilteringConfig = {
        invoiceId: {
          value: [{ value: '101', label: '101' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        status: {
          value: [{ value: 'Paid', label: 'Paid' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        billingAddress: {
          value: [{ value: '123 Billing St', label: '123 Billing St' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        amount: {
          value: [{ value: '1000', label: '1000' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        dueDate: {
          value: [{ value: '15-05-2024', label: '15-05-2024' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        plannedPaymentDate: {
          value: [{ value: '20-05-2024', label: '20-05-2024' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        referenceNumber: {
          value: [{ value: 'REF123', label: 'REF123' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        issueDate: {
          value: [{ value: '10-05-2024', label: '10-05-2024' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        contactPerson: {
          value: [{ value: 'John Doe', label: 'John Doe' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        company: {
          value: [{ value: 'Acme Inc', label: 'Acme Inc' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        originalInvoiceNumber: {
          value: [{ value: 'INV-999', label: 'INV-999' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result =
        InvoiceListMapperService.mapToInvoiceExcelPayloadDto(filterConfig);

      // Assert
      expect(result).toEqual({
        filters: {
          invoice: ['101'],
          status: ['Paid'],
          billingAddress: ['123 Billing St'],
          amount: ['1000'],
          due: ['2024-05-15'],
          plannedPaymentDate: ['2024-05-20'],
          referenceNumber: ['REF123'],
          issueDate: ['2024-05-10'],
          contactPerson: ['John Doe'],
          company: ['Acme Inc'],
          originalInvoice: ['INV-999'],
        },
      });
    });
  });
});
