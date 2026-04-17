import { BaseApolloResponse } from "@customer-portal/shared";

export interface ProfileLanguageDto extends BaseApolloResponse<ProfileLanguageDataDto> {
  data: ProfileLanguageDataDto;
  isSuccess: boolean;
}

export interface ProfileLanguageDataDto {
  portalLanguage: string;
}
