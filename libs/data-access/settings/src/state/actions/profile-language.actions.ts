import { Language } from '@customer-portal/shared';

export class LoadProfileLanguage {
  static readonly type = '[Profile] Load Language';
}

export class LoadProfileLanguageSuccess {
  static readonly type = '[Profile] Load Language Success';

  constructor(public languageLabel: Language) {}
}

export class UpdateProfileLanguage {
  static readonly type = '[Profile] Update Language';

  constructor(public languageLabel: Language) {}
}

export class UpdateProfileLanguageSuccess {
  static readonly type = '[Profile] Update Language Success';

  constructor(public languageLabel: Language) {}
}

export class SetProfileLanguage {
  static readonly type = '[Profile] Set Language';

  constructor(public languageLabel: string) {}
}
