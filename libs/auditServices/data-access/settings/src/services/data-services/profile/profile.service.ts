import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { ProfileDto } from '../../../dtos';
import { PROFILE_QUERY, PROFILE_SETTINGS_MUTATION } from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getProfileData(): Observable<ProfileDto | null> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: PROFILE_QUERY,
        variables: {},
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result: any) => {
          if (
            result === undefined ||
            result?.data === undefined ||
            result.data?.userProfile?.isSuccess === false
          ) {
            return null;
          }

          return result.data?.userProfile;
        }),
        catchError((_) => of(null)),
      );
  }

  updateProfileSettingsData(
    communicationLanguage: string,
    jobTitle: string,
  ): Observable<any> {
    return this.apollo.use(this.clientName).mutate({
      mutation: PROFILE_SETTINGS_MUTATION,
      variables: {
        communicationLanguage,
        jobTitle,
      },
    });
  }
}
