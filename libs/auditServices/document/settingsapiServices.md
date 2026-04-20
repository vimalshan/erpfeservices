# Settings API Services Documentation

## Service Overview

**Service Name:** settingsapiServices  
**Description:** Manages system settings, users, and preferences  
**Base URL:** http://localhost:5004  
**Port:** 5004  
**Apollo Client:** `contact` → `contactGraphqlHost`

> **Note:** Although `settingsGraphqlHost` (port 5009) is defined in the environment model, all settings data services actually use the `contact` Apollo client, which maps to `contactGraphqlHost` (port 5004).

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. userCompanyDetails
Get user company details

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| userId | int? | User ID (optional) |

**Query:**
```graphql
query {
  userCompanyDetails(userId: 123) {
    data {
      userId
      companyId
      companyName
      role
      department
    }
  }
}
```

**Return Type:** `ApiResponse<SettingsCompanyDetailsResponse>`

---

### 2. adminList
Get admin user list

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| accountDNVId | string? | Account DNV ID (optional) |
| userId | int? | User ID (optional) |

**Query:**
```graphql
query {
  adminList(accountDNVId: "dnv123") {
    data {
      id
      name
      email
      role
      status
      createdDate
    }
  }
}
```

**Return Type:** `ApiResponse<List<AdminUserResponse>>`

---

### 3. memberList
Get member user list

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| accountDNVId | string? | Account DNV ID (optional) |
| userId | int? | User ID (optional) |

**Query:**
```graphql
query {
  memberList(accountDNVId: "dnv123") {
    data {
      id
      name
      email
      role
      status
      createdDate
    }
  }
}
```

**Return Type:** `ApiResponse<List<MemberUserResponse>>`

---

### 4. getCountries
Get countries list

**Query:**
```graphql
query {
  getCountries {
    data {
      id
      name
      code
      region
    }
  }
}
```

**Return Type:** `ApiResponse<List<CountryResponse>>`

---

### 5. preferences
Get preferences

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| objectType | string | Object type |
| objectName | string | Object name |
| pageName | string | Page name |

**Query:**
```graphql
query {
  preferences(
    objectType: "User"
    objectName: "UserSettings"
    pageName: "Settings"
  ) {
    data {
      id
      key
      value
    }
  }
}
```

**Return Type:** `ApiResponse<PreferenceResponse>`

---

## GraphQL Mutations

### 1. updateCompanyDetails
Update company details

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CompanyDetailsUpdateRequest | Company details |

**Mutation:**
```graphql
mutation {
  updateCompanyDetails(input: {
    companyId: 1
    companyName: "Updated Company Name"
    address: "New Address"
    city: "New City"
    country: "US"
  }) {
    data {
      companyId
      companyName
      address
      city
    }
    success
    message
  }
}
```

**Return Type:** `ApiResponse<CompanyDetailsUpdateResponse>`

---

### 2. updateUserPreferences
Update user preferences

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| userId | int | User ID |
| input | UserPreferencesUpdateRequest | Preferences |

**Mutation:**
```graphql
mutation {
  updateUserPreferences(
    userId: 123
    input: {
      theme: "dark"
      language: "en"
      timezone: "UTC"
      emailNotifications: true
    }
  ) {
    data {
      userId
      theme
      language
      timezone
    }
    success
    message
  }
}
```

**Return Type:** `ApiResponse<UserPreferencesUpdateResponse>`

---

### 3. updateSystemPreferences
Update system preferences

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | SystemPreferencesUpdateRequest | System preferences |

**Mutation:**
```graphql
mutation {
  updateSystemPreferences(input: {
    maintenanceMode: false
    enableLogging: true
    logLevel: "Info"
    sessionTimeout: 30
  }) {
    data {
      maintenanceMode
      enableLogging
      logLevel
    }
    success
    message
  }
}
```

**Return Type:** `ApiResponse<SystemPreferencesUpdateResponse>`

---

### 4. updateNotificationTemplate
Update notification template

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | NotificationTemplateUpdateRequest | Template data |

**Mutation:**
```graphql
mutation {
  updateNotificationTemplate(input: {
    templateId: 1
    templateName: "Audit Scheduled"
    subject: "Audit Scheduled: {{auditName}}"
    body: "Your audit is scheduled for {{date}}"
  }) {
    data {
      templateId
      templateName
      subject
    }
    success
    message
  }
}
```

**Return Type:** `ApiResponse<NotificationTemplateUpdateResponse>`

---

### 5. createUser
Create a new user

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateUserDto | User creation data |

**Mutation:**
```graphql
mutation {
  createUser(input: {
    firstName: "John"
    lastName: "Doe"
    email: "john.doe@example.com"
    username: "jdoe"
    password: "SecurePassword123!"
    roleId: 2
    companyId: 1
  }) {
    id
    firstName
    lastName
    email
    role
    status
  }
}
```

**Return Type:** `UserDto`

---

### 6. updateUser
Update user

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateUserDto | User update data |

**Mutation:**
```graphql
mutation {
  updateUser(input: {
    id: 123
    firstName: "Jane"
    lastName: "Smith"
    email: "jane.smith@example.com"
    roleId: 3
  }) {
    id
    firstName
    lastName
    email
    role
  }
}
```

**Return Type:** `UserDto`

---

### 7. deactivateUser
Deactivate user

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| userId | int | User ID |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  deactivateUser(
    userId: 123
    modifiedBy: 456
  )
}
```

**Return Type:** `bool`

---

### 8. createRole
Create a role

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateRoleDto | Role creation data |

**Mutation:**
```graphql
mutation {
  createRole(input: {
    roleName: "Senior Auditor"
    description: "Senior auditor role with full permissions"
    permissions: ["Create", "Read", "Update", "Delete"]
  }) {
    id
    roleName
    description
  }
}
```

**Return Type:** `RoleDto`

---

### 9. setUserPreference
Set user preference

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | SetUserPreferenceDto | Preference data |

**Mutation:**
```graphql
mutation {
  setUserPreference(input: {
    userId: 123
    preferenceKey: "dashboard_layout"
    preferenceValue: "compact"
  }) {
    id
    userId
    preferenceKey
    preferenceValue
  }
}
```

**Return Type:** `UserPreferenceDto`

---

## cURL Examples

### Query: Get User Company Details
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { userCompanyDetails(userId: 123) { data { userId companyId companyName role } } }"
  }'
```

### Query: Get Admin List
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { adminList { data { id name email role status } } }"
  }'
```

### Query: Get Member List
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { memberList { data { id name email role status } } }"
  }'
```

### Query: Get Countries
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getCountries { data { id name code region } } }"
  }'
```

### Mutation: Update Company Details
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateCompanyDetails(input: { companyId: 1, companyName: \"New Name\", address: \"New Address\" }) { data { companyId companyName } success message } }"
  }'
```

### Mutation: Update User Preferences
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateUserPreferences(userId: 123, input: { theme: \"dark\", language: \"en\" }) { data { userId theme language } success message } }"
  }'
```

### Mutation: Create User
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createUser(input: { firstName: \"John\", lastName: \"Doe\", email: \"john@example.com\", username: \"jdoe\", password: \"Pass123!\", roleId: 2, companyId: 1 }) { id firstName lastName email role } }"
  }'
```

### Mutation: Update User
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateUser(input: { id: 123, firstName: \"Jane\", lastName: \"Smith\", email: \"jane@example.com\" }) { id firstName lastName email } }"
  }'
```

### Mutation: Deactivate User
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deactivateUser(userId: 123, modifiedBy: 456) }"
  }'
```

### Mutation: Create Role
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createRole(input: { roleName: \"Senior Auditor\", description: \"Senior role\", permissions: [\"Create\", \"Read\", \"Update\"] }) { id roleName description } }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "userCompanyDetails": {
      "data": {
        "userId": 123,
        "companyId": 1,
        "companyName": "Example Corp",
        "role": "Manager"
      }
    }
  }
}
```

### Error Response
```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

---

## Authentication

All requests require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_AUTH_TOKEN
```

---

## Notes

- Replace `YOUR_AUTH_TOKEN` with your actual authentication token
- Use `http://localhost:5004` for local development
- All timestamps are in ISO 8601 format
- User status values: "Active", "Inactive", "Suspended", "Pending"
- Role names should be unique within the system
- Passwords must meet security requirements (minimum 8 characters, mix of upper/lowercase, numbers, special characters)
- Theme options: "light", "dark", "auto"
- Common timezones: UTC, US/Eastern, US/Central, US/Mountain, US/Pacific, Europe/London, Europe/Paris, Asia/Tokyo
