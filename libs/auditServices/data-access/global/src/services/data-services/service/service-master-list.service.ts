import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { SERVICE_MASTER_LIST } from '../../../graphql';
import { ServiceMasterListModel } from '../../../models';

@Injectable({ providedIn: 'root' })
export class ServiceMasterListService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getServiceMasterList(): Observable<ServiceMasterListModel | null> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SERVICE_MASTER_LIST,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result: any) => {
          if (
            result === undefined ||
            result?.data === undefined ||
            result.data?.masterServiceList?.isSuccess === false
          ) {
            return null;
          }

          return result.data?.masterServiceList;
        }),
        catchError((_) => of(null)),
      );
  }
}
