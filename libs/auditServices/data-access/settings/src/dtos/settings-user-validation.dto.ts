export interface UserValidationDto {
  data: ValidateUserDto;
  isSuccess: boolean;
}

export interface ValidateUserDto {
  userIsActive: boolean;
  policySubCode: null | number;
  termsAcceptanceRedirectUrl: string;
}
