import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';

import { ProfileDto } from '../../../dtos';
import { PROFILE_SETTINGS_MUTATION } from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private clientName = 'contact';

  constructor(private readonly apollo: Apollo) {}

  getProfileData(): Observable<ProfileDto | null> {
    // userProfile query is not available on the backend (port 5004)
    return of({
      data: {
        firstName: '',
        lastName: '',
        displayName: '',
        country: '',
        countryCode: '',
        region: '',
        email: '',
        phone: '',
        portalLanguage: 'en',
        veracityId: '',
        communicationLanguage: 'English',
        jobTitle: '',
        languages: [],
        accessLevel: [{ roleName: 'User', roleLevel: [1] }],
        sidebarMenu: [],
      },
      isSuccess: true,
    } as ProfileDto);
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
