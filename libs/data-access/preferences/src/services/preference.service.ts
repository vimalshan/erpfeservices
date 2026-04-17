import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import { BaseApolloService } from '@customer-portal/core';

import { PreferenceDto, PreferenceSaveResponse } from '../dtos';
import { GET_PREFERENCE_QUERY, SAVE_PREFERENCES_MUTATION } from '../graphql';

@Injectable({
  providedIn: 'root',
})
export class PreferenceService extends BaseApolloService {
  private clientName = 'contact';

  savePreferencesNoCache(preferenceRequest: PreferenceDto) {
    return this.apollo.use(this.clientName).mutate({
      mutation: SAVE_PREFERENCES_MUTATION,
      variables: {
        preferenceRequest,
      },
    });
  }

  getPreferenceNocache(
    objectType: string,
    objectName: string,
    pageName: string,
  ) {
    return this.apollo
      .use(this.clientName)
      .query({
        query: GET_PREFERENCE_QUERY,
        variables: {
          objectType,
          objectName,
          pageName,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result: any) => result.data?.preferences));
  }

  savePreferences(preferenceRequest: PreferenceDto) {
    const fieldName =
      this.getQueryRootFieldName(GET_PREFERENCE_QUERY) || 'preferences';

    return this.apollo
      .use(this.clientName)
      .mutate<PreferenceSaveResponse>({
        mutation: SAVE_PREFERENCES_MUTATION,
        variables: { preferenceRequest },
        refetchQueries: [
          {
            query: GET_PREFERENCE_QUERY,
            variables: {
              objectType: preferenceRequest.objectType,
              objectName: preferenceRequest.objectName,
              pageName: preferenceRequest.pageName,
            },
          },
        ],
        awaitRefetchQueries: true,
        onQueryUpdated: (observableQuery) =>
          new Promise((resolve) => {
            const subscription = observableQuery.subscribe({
              next: () => {
                subscription.unsubscribe();
                resolve('success');
              },
              error: () => {
                subscription.unsubscribe();

                this.evictFromCache(this.clientName, fieldName, {
                  objectType: preferenceRequest.objectType,
                  objectName: preferenceRequest.objectName,
                  pageName: preferenceRequest.pageName,
                });

                resolve('error');
              },
            });
          }),
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  getPreference(objectType: string, objectName: string, pageName: string) {
    const fieldName =
      this.getQueryRootFieldName(GET_PREFERENCE_QUERY) || 'preferences';

    return this.apollo
      .use(this.clientName)
      .watchQuery({
        query: GET_PREFERENCE_QUERY,
        variables: {
          objectType,
          objectName,
          pageName,
        },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
      })
      .valueChanges.pipe(
        map((result: any) => {
          if (
            result === undefined ||
            result?.data === undefined ||
            result?.errors ||
            result.data?.preferences?.isSuccess === false
          ) {
            this.evictFromCache(this.clientName, fieldName, {
              objectType,
              objectName,
              pageName,
            });
          }

          return result.data?.preferences;
        }),
      );
  }
}
