import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { SITE_MASTER_LIST } from '../../../graphql';
import { SiteMasterListModel } from '../../../models';

@Injectable({ providedIn: 'root' })
export class SiteMasterListService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getSiteMasterList(): Observable<SiteMasterListModel | null> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SITE_MASTER_LIST,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result: any) => {
          if (
            result === undefined ||
            result?.data === undefined ||
            result.data?.masterSiteList?.isSuccess === false
          ) {
            return null;
          }

          return result.data?.masterSiteList;
        }),
        catchError((_) => of(null)),
      );
  }
}
