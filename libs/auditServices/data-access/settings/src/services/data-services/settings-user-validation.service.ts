import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { SETTINGS_USER_VALIDATION_QUERY } from '../../graphql';
import { UserValidation } from '../../models/profile.model';

@Injectable({ providedIn: 'root' })
export class SettingsUserValidationService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getUserValidation(): Observable<UserValidation> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SETTINGS_USER_VALIDATION_QUERY,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((results: any) => {
          if (
            results === undefined ||
            results?.data === undefined ||
            results?.errors ||
            results.data?.validateUser?.isSuccess === false
          ) {
            const errorMessage =
              results?.errors?.[0]?.message ||
              results?.data?.validateUser?.message ||
              'User validation failed';
            throw new Error(errorMessage);
          }

          return results?.data?.validateUser?.data;
        }),
      );
  }
}
