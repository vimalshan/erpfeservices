import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { Language } from '@customer-portal/shared';

import { ProfileLanguageDto } from '../../../dtos';
import {
  PROFILE_LANGUAGE_MUTATION,
  PROFILE_LANGUAGE_QUERY,
} from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ProfileLanguageService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getProfileLanguage(): Observable<ProfileLanguageDto | null> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: PROFILE_LANGUAGE_QUERY,
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

  updateProfileLanguage(language: Language): Observable<ProfileLanguageDto> {
    return this.apollo
      .use(this.clientName)
      .mutate({
        mutation: PROFILE_LANGUAGE_MUTATION,
        variables: {
          language,
        },
      })
      .pipe(map((results: any) => results?.data?.updateProfile));
  }
}
