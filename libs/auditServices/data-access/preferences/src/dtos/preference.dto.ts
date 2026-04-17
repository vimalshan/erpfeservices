export interface PreferenceResponseDto {
  data: PreferenceDto;
  isSuccess: boolean;
}

export interface PreferenceDto {
  pageName: string;
  objectType: string;
  objectName: string;
  preferenceDetail: string;
}

export interface PreferenceSaveResponse {
  data: {
    preferences: {
      isSuccess: boolean;
      message: string;
      errorCode: string;
      __typename: string;
    };
  };
}
