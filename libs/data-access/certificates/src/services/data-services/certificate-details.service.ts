import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';

import {
  ALL_CERTIFICATION_MARKS_QUERY,
  CERTIFICATE_SITES_LIST_QUERY,
  DOWNLOAD_CERTIFICATION_MARK_QUERY,
  GET_CERTIFICATE_DETAILS_QUERY,
} from '../../graphql';

@Injectable({ providedIn: 'root' })
export class CertificatesDetailsService {
  private clientName = 'certificate';

  constructor(private readonly apollo: Apollo) {}

  getSitesList(certificateId: number) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: CERTIFICATE_SITES_LIST_QUERY,
        variables: {
          certificateId,
        },
      })
      .pipe(map((results: any) => results.data.sitesInScope));
  }

  getCertificatedDetails(certificateId: number) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: GET_CERTIFICATE_DETAILS_QUERY,
        variables: {
          certificateId,
        },
      })
      .pipe(map((results: any) => results.data.viewCertificateDetails));
  }

  getAllCertificationMarks(serviceName: string, language: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: ALL_CERTIFICATION_MARKS_QUERY,
        variables: {
          serviceName,
          language,
        },
      })
      .pipe(map((results: any) => results.data.getAllCertMarks));
  }

  downloadCertificationMark(downloadLink: string) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: DOWNLOAD_CERTIFICATION_MARK_QUERY,
        variables: {
          downloadLink,
        },
        context: {
          headers: {
            SKIP_LOADING: 'true',
          },
        },
      })
      .pipe(map((results: any) => results.data.downloadCertMark));
  }
}
