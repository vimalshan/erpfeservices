import { PreferenceModel } from '../models';

export class LoadPreference {
  static readonly type = '[Preferences] Load Preference';

  constructor(
    public pageName: string,
    public objectName: string,
    public objectType: string,
  ) {}
}

export class LoadPreferenceSuccess {
  static readonly type = '[Preferences] Load Preferences Success';

  constructor(public preference: PreferenceModel | null) {}
}

export class LoadPreferenceFail {
  static readonly type = '[Preferences] Load Preferences Fail';

  constructor(public error: string) {}
}

export class SavePreference {
  static readonly type = '[Preferences] Save Preference';

  constructor(public preference: PreferenceModel) {}
}
