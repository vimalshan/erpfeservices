import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';

import { Language } from '@customer-portal/shared';

import {
  LoadProfileLanguage,
  SetProfileLanguage,
  UpdateProfileLanguage,
} from '../actions';
import { ProfileLanguageSelectors } from '../selectors';

@Injectable({ providedIn: 'root' })
export class ProfileLanguageStoreService {
  constructor(private store: Store) {}

  get languageLabel(): Signal<Language> {
    return this.store.selectSignal(ProfileLanguageSelectors.languageLabel);
  }

  get profileLanguageLabel(): Observable<Language> {
    return this.store.select(ProfileLanguageSelectors.languageLabel);
  }

  get profileDataLanguageError$(): Observable<string | null> {
    return this.store.select(
      (state) => state.settings.loadingErrors.profileDataLanguage,
    );
  }

  get profileLanguageDataLoaded$(): Observable<boolean> {
    return this.store.select(
      (state) => state.settings.loadedStates.profileLanguage,
    );
  }

  @Dispatch()
  loadProfileLanguage = () => new LoadProfileLanguage();

  @Dispatch()
  setProfileLanguage = (languageLabel: string) =>
    new SetProfileLanguage(languageLabel);

  @Dispatch()
  updateProfileLanguage = (languageLabel: Language) =>
    new UpdateProfileLanguage(languageLabel);
}
