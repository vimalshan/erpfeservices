import { BaseApolloResponse } from "@erp-services/shared";

export interface ProfileLanguageDto extends BaseApolloResponse<ProfileLanguageDataDto> {
  data: ProfileLanguageDataDto;
  isSuccess: boolean;
  message?: string;
}

export interface ProfileLanguageDataDto {
  portalLanguage: string;
}
