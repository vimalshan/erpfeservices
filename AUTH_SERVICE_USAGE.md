# AuthProvider API - Service Usage

## Overview

The auth service connects to the **AuthProvider API v1.0** running at `http://localhost:5200`.  
Swagger UI: [http://localhost:5200/swagger/index.html](http://localhost:5200/swagger/index.html)  
All endpoints require a Bearer JWT token (via `Authorization: Bearer {token}`) except login and register.

## API Endpoints

### Auth

| Method | Endpoint | Request Body | Response | Purpose |
|--------|----------|-------------|----------|---------|
| POST | `/api/v1/Auth/register` | `CreateUserDto` | `201` → `UserDto` | Register a new user |
| POST | `/api/v1/Auth/login` | `LoginRequestDto` | `200` → `TokenResponseDto` | Login and get tokens |
| POST | `/api/v1/Auth/refresh-token` | `RefreshTokenRequest` | `200` → `TokenResponseDto` | Refresh an expired access token |
| POST | `/api/v1/Auth/revoke-token` | `RevokeTokenRequest` | `204` No Content | Revoke a refresh token (logout) |
| GET | `/api/v1/Auth/me` | — | `200` → `UserDto` | Get current authenticated user |

### Users

| Method | Endpoint | Parameters | Response | Purpose |
|--------|----------|-----------|----------|---------|
| GET | `/api/v1/Users` | `?page=1&pageSize=20` | `UserDtoPagedResult` | List users (paginated) |
| GET | `/api/v1/Users/{id}` | `id` (UUID) | `UserDto` | Get user by ID |
| PUT | `/api/v1/Users/{id}` | `UpdateUserDto` | `UserDto` | Update user |
| DELETE | `/api/v1/Users/{id}` | `id` (UUID) | `204` No Content | Delete user |
| GET | `/api/v1/Users/by-email` | `?email=` | `UserDto` | Find user by email |
| POST | `/api/v1/Users/{id}/roles` | `AssignRoleDto` | `204` No Content | Assign role to user |
| GET | `/api/v1/roles` | — | `RoleDto[]` | List all roles |

### Health

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/minimal/auth/health` | Health check |
| GET | `/api/v1/minimal/auth/version` | Version info |

## DTOs / Schemas

### LoginRequestDto
```json
{
  "usernameOrEmail": "string",
  "password": "string"
}
```

### TokenResponseDto
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresAt": "2026-04-18T00:00:00Z",
  "tokenType": "string"
}
```

### CreateUserDto
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

### UserDto
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "isActive": true,
  "isEmailVerified": true,
  "createdAt": "2026-04-18T00:00:00Z",
  "lastLoginAt": "2026-04-18T00:00:00Z",
  "roles": ["string"]
}
```

### UpdateUserDto
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string"
}
```

### RefreshTokenRequest / RevokeTokenRequest
```json
{
  "refreshToken": "string"
}
```

### AssignRoleDto
```json
{
  "userId": "uuid",
  "roleName": "string"
}
```

### RoleDto
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string"
}
```

### UserDtoPagedResult
```json
{
  "items": [UserDto],
  "totalCount": 0,
  "page": 1,
  "pageSize": 20
}
```

## Frontend Endpoint Mapping

The frontend `AuthService` methods need to map to the new API:

| AuthService Method | Old Endpoint | New API Endpoint |
|-------------------|-------------|-----------------|
| `loginWithCredentials()` | `/token` (POST) | `/api/v1/Auth/login` (POST) |
| `getToken()` | `/GetAccessToken` (GET) | `/api/v1/Auth/refresh-token` (POST) |
| `isUserAuthenticatedWithExpiryInfo()` | `/UserAuthenticatedwithExpiry` (GET) | `/api/v1/Auth/me` (GET) |
| `isUserAuthenticated()` | `/IsUserAuthenticated` (GET) | `/api/v1/Auth/me` (GET) |
| `isUserValidated()` | `/ValidateUser` (GET) | `/api/v1/Auth/me` (GET) |
| `getClientCredentialToken()` | `/Status` (GET) | `/api/v1/minimal/auth/health` (GET) |
| `logout()` | `/Logout` (POST) | `/api/v1/Auth/revoke-token` (POST) |

## Environment Configuration

The environment `authApiUrl` is proxied through the dev server to avoid CORS issues:

```typescript
// environment.ts
authApiUrl: '/auth-api'

// proxy.conf.json routes /auth-api/* → http://localhost:5200/*
```

## Files

1. `libs/auditServices/environments/src/environment.ts` — API URL configuration
2. `libs/auditServices/shared/src/services/auth/auth.service.ts` — Auth service
3. `libs/auditServices/shared/src/models/auth-login.model.ts` — Login request/response models
4. `libs/auditServices/shared/src/models/auth-service.reponse.ts` — Auth check response model
5. `proxy.conf.json` — Dev proxy configuration