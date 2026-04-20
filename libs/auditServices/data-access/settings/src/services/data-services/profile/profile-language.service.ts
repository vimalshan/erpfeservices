import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';

import { Language } from '@erp-services/shared';

import { ProfileLanguageDto } from '../../../dtos';
import {
  PROFILE_LANGUAGE_MUTATION,
} from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ProfileLanguageService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getProfileLanguage(): Observable<ProfileLanguageDto | null> {
    // userProfile query (for language) is not available on the backend (port 5004)
    return of({
      data: { portalLanguage: 'en' },
      isSuccess: true,
    } as ProfileLanguageDto);
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
