import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  MANAGE_MEMBER_PERMISSION_MUTATION,
  SETTINGS_USER_DETAILS_TO_MANAGE_PERMISSION,
} from '../../graphql';
import { ManageMembersRequestModel } from '../../models';

@Injectable({ providedIn: 'root' })
export class SettingsUserDetailsToManagePermission {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getUserDetailsToManagePermission(memberEmail: string): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_USER_DETAILS_TO_MANAGE_PERMISSION,
        variables: {
          memberEmail,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data));
  }

  submitManageMembersPermissions(
    manageMemberRequest: ManageMembersRequestModel,
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .mutate({
        mutation: MANAGE_MEMBER_PERMISSION_MUTATION,
        variables: {
          manageMemberRequest,
        },
      })
      .pipe(map((results: any) => results?.data));
  }
}
