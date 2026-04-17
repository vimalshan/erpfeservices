import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { InvoiceListStoreService } from '@customer-portal/data-access/financials';

import { UpdatePlannedPaymentDateComponent } from './update-planned-payment-date.component';

describe('UpdatePlannedPaymentDateComponent', () => {
  let component: UpdatePlannedPaymentDateComponent;
  const configMock = {
    data: {
      invoiceIds: ['1', '2', '3'],
    },
  };
  const invoiceListStoreServiceMock: Partial<InvoiceListStoreService> = {
    getInvoicesByIds: jest.fn(),
    switchCanUploadData: jest.fn(),
  };

  beforeEach(async () => {
    component = new UpdatePlannedPaymentDateComponent(
      configMock as DynamicDialogConfig,
      invoiceListStoreServiceMock as InvoiceListStoreService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('ngOnInit should call loadInvoiceListById with invoiceIds', () => {
    component.ngOnInit();
    expect(invoiceListStoreServiceMock.getInvoicesByIds).toHaveBeenCalledWith(
      configMock.data.invoiceIds,
    );
  });

  test('ngOnInit should set invoices to invoiceListStoreService.invoicesById', () => {
    component.ngOnInit();
    expect(component.invoices).toEqual(invoiceListStoreServiceMock.invoices);
  });

  test('ngOnDestroy should call switchCanUploadData with false', () => {
    component.ngOnDestroy();
    expect(
      invoiceListStoreServiceMock.switchCanUploadData,
    ).toHaveBeenCalledWith(false);
  });

  test('checkResponses should call switchCanUploadData with true when date is set', () => {
    component.date = new Date();
    component.checkResponses();
    expect(
      invoiceListStoreServiceMock.switchCanUploadData,
    ).toHaveBeenCalledWith(true);
  });
});
