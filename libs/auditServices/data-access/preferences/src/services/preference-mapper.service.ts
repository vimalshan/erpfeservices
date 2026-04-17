import { PreferenceDto, PreferenceResponseDto } from '../dtos';
import { PreferenceModel } from '../models';

export class PreferenceMapperService {
  static mapToPreferenceModel(
    dto: PreferenceResponseDto,
  ): PreferenceModel | null {
    if (!dto?.data) {
      return null;
    }

    const { data } = dto;

    return {
      data: JSON.parse(data.preferenceDetail),
      objectName: data.objectName,
      objectType: data.objectType,
      pageName: data.pageName,
    };
  }

  static mapToPreferenceDto(preference: PreferenceModel): PreferenceDto {
    const preferenceDetail = preference.data;

    return {
      objectName: preference.objectName,
      objectType: preference.objectType,
      pageName: preference.pageName,
      preferenceDetail: JSON.stringify(preferenceDetail),
    };
  }
}
