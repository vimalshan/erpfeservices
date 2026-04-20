import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { UserValidation } from '../../models/profile.model';

@Injectable({ providedIn: 'root' })
export class SettingsUserValidationService {
  getUserValidation(): Observable<UserValidation> {
    // validateUser query is not available on the backend (port 5004)
    return of({
      userIsActive: true,
      termsAcceptanceRedirectUrl: '',
      policySubCode: null,
      isSuaadhyaUser: false,
      userEmail: '',
      veracityId: '',
      portalLanguage: 'en',
      isAdmin: false,
    });
  }
}
