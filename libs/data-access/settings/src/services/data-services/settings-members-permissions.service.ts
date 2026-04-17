import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  ADD_NEW_MEMBER_MUTATION,
  REMOVE_MEMBER_MUTATION,
  SETTINGS_MEMBERS_PERMISSIONS_QUERY,
} from '../../graphql';
import { CreateContactRequest } from '../../models';

@Injectable({ providedIn: 'root' })
export class SettingsMembersPermissionsService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getSettingsMembersPermissions(
    memberEmail: string,
    accountDnvId: string | null,
  ): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_MEMBERS_PERMISSIONS_QUERY,
        variables: {
          memberEmail,
          accountDNVId: accountDnvId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.getUserPermissions));
  }

  createNewMember(memberDetails: CreateContactRequest): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .mutate({
        mutation: ADD_NEW_MEMBER_MUTATION,
        variables: {
          createContactRequest: memberDetails,
        },
      })
      .pipe(map((results: any) => results?.data?.createContactDetails));
  }

  removeMember(memberEmail: string): Observable<any> {
    return this.apollo
      .use(this.clientName)
      .mutate({
        mutation: REMOVE_MEMBER_MUTATION,
        variables: {
          removeContactRequest: {
            email: memberEmail,
          },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.removeContact));
  }
}
