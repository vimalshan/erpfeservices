import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { SETTINGS_MEMBERS_ROLES_QUERY } from '../../graphql';

@Injectable({ providedIn: 'root' })
export class SettingsMembersRolesService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getSettingsMembersRoles(): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_MEMBERS_ROLES_QUERY,
      })
      .pipe(map((results: any) => results?.data?.functionalRoleList));
  }
}
