export interface AuthServiceResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  roles: string[];
  isUserAuthenticated?: boolean;
  expiryTimeUtc?: string;
}
