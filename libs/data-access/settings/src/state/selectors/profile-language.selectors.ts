import { Selector } from '@ngxs/store';

import { Language } from '@customer-portal/shared';

import { SettingsState, SettingsStateModel } from '../settings.state';

export class ProfileLanguageSelectors {
  @Selector([ProfileLanguageSelectors._languageLabel])
  static languageLabel(languageLabel: Language): Language {
    return languageLabel;
  }

  @Selector([SettingsState])
  private static _languageLabel(state: SettingsStateModel): Language {
    return state?.languageLabel;
  }
}
