import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { SETTINGS_ADMIN_LIST_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class SettingsAdminListService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getSettingsAdminList(accountDnvId: string | null): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_ADMIN_LIST_QUERY,
        variables: {
          accountDNVId: accountDnvId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.adminList));
  }
}
