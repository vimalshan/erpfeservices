import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { CO_BROWSING_COMPANY_LIST } from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class CoBrowsingCompanyListService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getCompanyList(): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: CO_BROWSING_COMPANY_LIST,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.viewAllCompanyList));
  }
}
