import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { CertificateExcelPayloadDto, CertificateListDto } from '../../dtos';
import { CERTIFICATE_LIST_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class CertificateListService {
  private clientName = 'certificate';

  private readonly exportCertificateExcelUrl = `${environment.documentsApi}/ExportCertificates`;

  constructor(
    private readonly apollo: Apollo,
    private http: HttpClient,
  ) {}

  getCertificateList(): Observable<CertificateListDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: CERTIFICATE_LIST_QUERY,
      })
      .pipe(map((results: any) => results.data.certificates));
  }

  exportCertificatesExcel(
    { filters }: CertificateExcelPayloadDto,
    skipLoading?: boolean,
  ): Observable<number[]> {
    let headers = new HttpHeaders();

    if (skipLoading) {
      headers = headers.append('SKIP_LOADING', 'true');
    }

    return this.http
      .post<{
        data: number[];
      }>(this.exportCertificateExcelUrl, filters, { headers })
      .pipe(map((response) => response.data));
  }
}
