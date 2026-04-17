import { Language } from '@erp-services/shared';

import { ProfileLanguageDto } from '../../dtos';

export class ProfileLanguageMapperService {
  static mapToProfileLanguageModel(dto: ProfileLanguageDto): Language {
    const languages = Object.values(Language) as string[];
    const portalLanguage = dto?.data?.portalLanguage;
    const isSupportedLanguage =
      portalLanguage && languages.includes(portalLanguage);

    return isSupportedLanguage
      ? (portalLanguage as Language)
      : Language.English;
  }
}
