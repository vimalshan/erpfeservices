import { signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { InvoiceListStoreService } from '@customer-portal/data-access/financials';

import { UpdatePlannedPaymentDateFooterComponent } from './update-planned-payment-date-footer.component';

describe('UpdatePlannedPaymentDateFooterComponent', () => {
  let component: UpdatePlannedPaymentDateFooterComponent;
  const refMock: Partial<DynamicDialogRef> = {
    close: jest.fn(),
  };
  const invoiceListStoreServiceMock: Partial<InvoiceListStoreService> = {
    canUploadData: signal(false),
  };
  const mockDynamicDialogConfig = {
    data: {
      invoiceIds: ['123'],
    },
  };

  beforeEach(async () => {
    component = new UpdatePlannedPaymentDateFooterComponent(
      refMock as DynamicDialogRef,
      invoiceListStoreServiceMock as InvoiceListStoreService,
      mockDynamicDialogConfig as DynamicDialogConfig,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('canUploadData should be initialized from invoiceListStoreService', () => {
    // Assert
    expect(component.canUploadData).toBe(
      invoiceListStoreServiceMock.canUploadData,
    );
  });

  test('closeDialog should call ref.close with the provided data', () => {
    // Arrange
    const data = true;

    // Act
    component.closeDialog(data);

    // Assert
    expect(refMock.close).toHaveBeenCalledWith(data);
  });
});
