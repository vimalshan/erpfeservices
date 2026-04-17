import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { InvoiceExcelPayloadDto, InvoiceListDto } from '../../dtos';
import { InvoiceDownloadDataDto } from '../../dtos/invoice-download-data.dto';
import { UPDATE_PLANNED_PAYMENT_DATE_MUTATION } from '../../graphql/mutations';
import {
  DOWNLOAD_INVOICES_QUERY,
  INVOICE_LIST_QUERY,
} from '../../graphql/queries';

@Injectable({ providedIn: 'root' })
export class InvoiceListService {
  private clientName = 'invoice';

  private readonly exportInvoiceExcelUrl = `${environment.documentsApi}/ExportFinancials`;

  constructor(
    private readonly apollo: Apollo,
    private http: HttpClient,
  ) {}

  getInvoiceList(): Observable<InvoiceListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: INVOICE_LIST_QUERY,
        variables: {},
      })
      .pipe(map((results: any) => results?.data?.InvoiceListPage));
  }

  exportInvoices(
    { filters }: InvoiceExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.http
      .post<{
        data: number[];
      }>(this.exportInvoiceExcelUrl, filters, { headers })
      .pipe(map((response) => response.data));
  }

  downloadInvoices(
    invoiceNumbers: string[],
    skipLoading?: boolean,
  ): Observable<InvoiceDownloadDataDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: DOWNLOAD_INVOICES_QUERY,
        variables: {
          invoiceNumber: invoiceNumbers,
        },
        context: {
          headers: skipLoading ? { SKIP_LOADING: 'true' } : {},
        },
      })
      .pipe(map((results: any) => results.data.DownloadInvoice.data));
  }

  updatePlannedPaymentDate(invoicesId: string[], date: string) {
    return this.apollo.use(this.clientName).mutate({
      mutation: UPDATE_PLANNED_PAYMENT_DATE_MUTATION,
      variables: {
        invoiceNumber: invoicesId,
        plannedDates: date,
      },
      update: (cache) => {
        try {
          const existing: any = cache.readQuery({
            query: INVOICE_LIST_QUERY,
            variables: {},
          });
          if (!existing || !existing.InvoiceListPage?.data?.items) return;

          const updatedItems = existing.InvoiceListPage.data.items.map(
            (item: any) =>
              invoicesId.includes(item.invoice)
                ? { ...item, plannedPaymentDate: date }
                : item,
          );

          cache.writeQuery({
            query: INVOICE_LIST_QUERY,
            variables: {},
            data: {
              ...existing,
              InvoiceListPage: {
                ...existing.InvoiceListPage,
                data: {
                  ...existing.InvoiceListPage.data,
                  items: updatedItems,
                },
              },
            },
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error updating planned payment date in cache:', error);
        }
      },
    });
  }
}
