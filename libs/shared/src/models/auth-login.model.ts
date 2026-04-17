export interface LoginRequest {
  userName: string;
  password: string;
  deviceCode: string;
}

export interface LoginResponse {
  hasVerifiedEmail: boolean;
  tfaEnabled: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  issued: string;
  expires: string;
  refreshToken: string;
  resetToken?: string;
  tfaToken?: string;
  deviceCode?: string;
  last4?: string;
}
