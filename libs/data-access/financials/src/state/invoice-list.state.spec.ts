import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import {
  createRouteStoreServiceMock,
  RouteStoreService,
} from '@customer-portal/router';
import {
  createFileSaverMock,
  createMessageServiceMock,
  FilteringConfig,
  FilterMode,
  FilterOperator,
  getToastContentBySeverity,
  getTranslocoModule,
  ToastSeverity,
} from '@customer-portal/shared';

import { InvoiceListService } from '../services';
import { DownloadInvoices, ExportInvoicesExcel } from './actions';
import { InvoiceListState } from './invoice-list.state';

describe('InvoiceListState', () => {
  let store: Store;
  const invoiceListServiceMock = {
    exportInvoices: jest.fn().mockReturnValue(of({})),
    downloadInvoices: jest.fn().mockReturnValue(of({})),
  };

  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();

  beforeEach(() => {
    jest.clearAllMocks();

    createFileSaverMock();

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([InvoiceListState]), getTranslocoModule()],
      providers: [
        {
          provide: InvoiceListService,
          useValue: invoiceListServiceMock,
        },
        {
          provide: RouteStoreService,
          useValue: createRouteStoreServiceMock(),
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('ExportInvoicesExcel', () => {
    test('should request download invoices excel based on user filters and show success message', () => {
      // Arrange
      const userFilters: FilteringConfig = {
        invoiceId: {
          value: [{ value: '456', label: '456' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        status: {
          value: [{ value: 'Paid', label: 'Paid' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        dueDate: {
          value: [{ value: '15-05-2024', label: '15-05-2024' }],
          matchMode: FilterMode.DateBefore,
          operator: FilterOperator.And,
        },
        issueDate: {
          value: [{ value: '10-05-2024', label: '10-05-2024' }],
          matchMode: FilterMode.DateAfter,
          operator: FilterOperator.And,
        },
        company: {
          value: [{ value: 'Acme', label: 'Acme' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      store.reset({
        invoiceList: {
          gridConfig: {
            filtering: userFilters,
          },
        },
      });

      const expectedPayload = {
        filters: {
          invoice: ['456'],
          status: ['Paid'],
          billingAddress: null,
          amount: null,
          due: ['2024-05-15'],
          plannedPaymentDate: null,
          referenceNumber: null,
          issueDate: ['2024-05-10'],
          contactPerson: null,
          company: ['Acme'],
          originalInvoice: null,
        },
      };

      // Act
      store.dispatch(new ExportInvoicesExcel());

      // Assert
      expect(invoiceListServiceMock.exportInvoices).toHaveBeenCalledWith(
        expectedPayload,
      );
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' }),
      );
    });

    test('should show error message when invoice export fails', () => {
      // Arrange
      jest.spyOn(console, 'error').mockImplementationOnce(() => {});
      invoiceListServiceMock.exportInvoices = jest
        .fn()
        .mockReturnValue(throwError(() => new Error('500 error')));

      // Act
      store.dispatch(new ExportInvoicesExcel());

      // Assert
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'error' }),
      );
    });
  });

  describe('DownloadInvoices', () => {
    test('should download invoices and show success toast for multiple download', () => {
      // Arrange
      const mockContent = [1, 2, 3];
      const mockFileName = 'invoices.zip';
      const invoiceNumbers = ['INV-001', 'INV-002'];

      invoiceListServiceMock.downloadInvoices.mockReturnValue(
        of({ content: mockContent, fileName: mockFileName }),
      );

      // Act
      store.dispatch(new DownloadInvoices(invoiceNumbers, true));

      // Assert
      expect(invoiceListServiceMock.downloadInvoices).toHaveBeenCalledWith(
        invoiceNumbers,
      );
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        getToastContentBySeverity(ToastSeverity.DownloadStart),
      );
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        getToastContentBySeverity(ToastSeverity.DownloadSuccess),
      );
    });

    test('should download invoice without toasts if isMultipleDownload is false', () => {
      // Arrange
      const invoiceNumbers = ['INV-003'];
      const mockContent = [4, 5];
      const mockFileName = 'invoice.pdf';

      invoiceListServiceMock.downloadInvoices.mockReturnValueOnce(
        of({ content: mockContent, fileName: mockFileName }),
      );

      // Act
      store.dispatch(new DownloadInvoices(invoiceNumbers, false));

      // Assert
      expect(invoiceListServiceMock.downloadInvoices).toHaveBeenCalledWith(
        invoiceNumbers,
      );
      expect(messageServiceMock.add).not.toHaveBeenCalledWith(
        getToastContentBySeverity(ToastSeverity.DownloadStart),
      );
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        getToastContentBySeverity(ToastSeverity.DownloadSuccess),
      );
    });

    test('should show error toast if download fails', () => {
      // Arrange
      const invoiceNumbers = ['INV-404'];

      invoiceListServiceMock.downloadInvoices.mockReturnValueOnce(
        throwError(() => new Error('Simulated failure')),
      );

      // Act
      store.dispatch(new DownloadInvoices(invoiceNumbers, true));

      // Assert
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        getToastContentBySeverity(ToastSeverity.DownloadError),
      );
    });
  });
});
