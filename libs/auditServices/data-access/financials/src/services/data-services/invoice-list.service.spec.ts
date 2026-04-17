import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { InvoiceExcelPayloadDto, InvoiceListItemDto } from '../../dtos';
import { InvoiceDownloadDataDto } from '../../dtos/invoice-download-data.dto';
import { DOWNLOAD_INVOICES_QUERY, INVOICE_LIST_QUERY } from '../../graphql';
import { InvoiceListService } from './invoice-list.service';

describe('InvoiceListService', () => {
  let service: InvoiceListService;

  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
    mutate: jest.fn(),
  };

  const httpMock: Partial<HttpClient> = {
    post: jest.fn(),
  };

  beforeEach(() => {
    service = new InvoiceListService(
      apolloMock as Apollo,
      httpMock as HttpClient,
    );
  });

  describe('getInvoiceList', () => {
    test('should fetch and handle correct data', (done) => {
      const mockInvoiceListServiceDataItems: InvoiceListItemDto[] = [
        {
          amount: '8069.42 GBP',
          billingAddress:
            'Breakspear Park, Breakspear Way, HP2 4TZ, Hemel Hempstead, GB',
          company: 'Britvic Soft Drinks Ltd',
          contactPerson: 'John Donnelly',
          dueDate: '2018-07-29T00:00:00.000Z',
          invoice: '462010000301',
          issueDate: '2018-06-29T00:00:00.000Z',
          originalInvoice: null,
          plannedPaymentDate: null,
          referenceNumber: '4800051611 (2018)',
          reportingCountry: 'GB',
          projectNumber: 'PRJC-515558-2014-MSC-GBR',
          status: 'Paid',
        },
      ];

      const mockInvoiceListPage = {
        data: {
          items: mockInvoiceListServiceDataItems,
        },
      };

      apolloMock.query = jest.fn().mockReturnValue(
        of({
          data: {
            InvoiceListPage: mockInvoiceListPage,
          },
        }),
      );

      service.getInvoiceList().subscribe((result) => {
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: INVOICE_LIST_QUERY,
          variables: {},
          fetchPolicy: 'no-cache',
        });
        expect(result).toBe(mockInvoiceListPage);
        done();
      });
    });

    test('should handle undefined GraphQL response', (done) => {
      apolloMock.query = jest.fn().mockReturnValue(of(undefined));

      service.getInvoiceList().subscribe((result) => {
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: INVOICE_LIST_QUERY,
          variables: {},
          fetchPolicy: 'no-cache',
        });
        expect(result).toBeUndefined();
        done();
      });
    });
  });

  describe('exportInvoices', () => {
    test('should export invoices successfully', (done) => {
      const payload: InvoiceExcelPayloadDto = {
        filters: {
          invoice: [123],
          status: null,
          billingAddress: null,
          amount: null,
          due: null,
          plannedPaymentDate: null,
          referenceNumber: null,
          issueDate: null,
          contactPerson: null,
          company: null,
          originalInvoice: null,
        },
      };

      const mockResult = { data: [1, 2, 3] };
      (httpMock.post as jest.Mock).mockReturnValue(of(mockResult));

      service.exportInvoices(payload).subscribe((result) => {
        expect(httpMock.post).toHaveBeenCalledWith(
          expect.stringContaining('/ExportFinancials'),
          { filters: payload.filters },
        );
        expect(result).toEqual([1, 2, 3]);
        done();
      });
    });
  });

  describe('downloadInvoices', () => {
    test('should download invoices', (done) => {
      const invoiceNumbers = ['INV-001', 'INV-002'];

      const mockResponse: InvoiceDownloadDataDto = {
        content: [1, 2, 3, 4],
        fileName: 'invoices.zip',
        isZipped: false,
      };

      const mockGraphQLResponse = {
        data: {
          DownloadInvoice: {
            data: mockResponse,
          },
        },
      };

      apolloMock.query = jest.fn().mockReturnValue(of(mockGraphQLResponse));

      service.downloadInvoices(invoiceNumbers).subscribe((result) => {
        expect(apolloMock.query).toHaveBeenCalledWith({
          query: DOWNLOAD_INVOICES_QUERY,
          variables: {
            invoiceNumber: invoiceNumbers,
          },
        });
        expect(result).toEqual(mockResponse);
        done();
      });
    });
  });
});
