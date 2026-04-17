# Updated Auth Service Usage

## Overview

The auth service has been updated to work with your local API at `http://localhost:7136/api/authorize`. 

## API Endpoints Mapping

| Old Endpoint | New Endpoint | Purpose |
|-------------|-------------|---------|
| `/Auth/login` | `/token` (POST) | Login with credentials |
| `/Auth/GetAccessToken` | `/token` (GET) | Get access token |
| `/Auth/UserAuthenticatedwithExpiry` | `/token` (GET) | Check authentication with expiry |
| `/Auth/ValidateUser` | `/IsAuthenticated` | Validate user |
| `/Auth/Status` | `/IsAuthenticated` | Get authentication status |

## New Login Method

### 1. Basic Login with Credentials

```typescript
import { AuthService, LoginRequest } from '@erp-services/shared';

const loginRequest: LoginRequest = {
  userName: 'iyyanarmsec@gmail.com',
  password: 'HelpMe@&2405',
  deviceCode: '1'
};

this.authService.loginWithCredentials(loginRequest).subscribe({
  next: (response) => {
    console.log('Login successful:', response);
    
    // Store the token data
    this.authService.storeLoginResponse(response);
    
    // Redirect to dashboard
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    console.error('Login failed:', error);
  }
});
```

### 2. Response Structure

The login response will match your API response:

```typescript
interface LoginResponse {
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
```

### 3. Token Management

The service now provides methods to handle tokens:

```typescript
// Store login response (automatically called after successful login)
this.authService.storeLoginResponse(loginResponse);

// Get stored access token
const token = this.authService.getStoredAccessToken();

// Clear all token data (logout)
this.authService.clearTokenData();
```

### 4. HTTP Interceptor

Use the provided `AuthTokenInterceptor` to automatically add Bearer tokens to HTTP requests:

```typescript
// In your app.config.ts or module
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthTokenInterceptor,
    multi: true
  }
]
```

### 5. Environment Configuration

The environment has been updated to use your local API:

```typescript
authApiUrl: 'http://localhost:7136/api/authorize'
```

## Files Updated

1. `libs/environments/src/environment.ts` - Updated API URL
2. `libs/shared/src/services/auth/auth.service.ts` - Updated endpoints and added new login method
3. `libs/shared/src/models/auth-login.model.ts` - New interfaces for login
4. `src/app/components/login/login.component.ts` - Example login component
5. `src/app/interceptors/auth-token.interceptor.ts` - Token interceptor

## Testing

Test the login functionality with:
- Username: `iyyanarmsec@gmail.com`
- Password: `HelpMe@&2405`
- Device Code: `1`

The expected response should include an access token that gets stored in localStorage and automatically used for subsequent API calls.