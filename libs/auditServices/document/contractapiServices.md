# Contract API Services Documentation

## Service Overview

**Service Name:** contractapiServices  
**Description:** Manages audit contracts and contract tracking  
**Base URL (REST):** http://localhost:3000/docs-api (for contract list & export — uses `environment.documentsApi`)  
**Base URL (GraphQL):** http://localhost:5004 (for overview widgets — uses `contact` Apollo client → `contactGraphqlHost`)  
**Port:** 3000 (REST), 5004 (GraphQL)  

> **Note:** The contracts data-access module uses **REST** (`HttpClient` via `documentsApi`) for contract list and export operations. The GraphQL queries listed below (validateUser, userProfile, masterSiteList, overview widgets, etc.) are served by the **contact** GraphQL host and are shared with the overview module.

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. validateUser
Validate user

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| userId | string? | User ID |
| veracityId | string? | Veracity ID |

**Query:**
```graphql
query {
  validateUser(userId: "user123", veracityId: "veracity456") {
    data {
      isValid
      userId
      role
    }
  }
}
```

**Return Type:** `ApiResponse<UserValidationResponse>`

---

### 2. userProfile
Get user profile

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| userId | string? | User ID |
| veracityId | string? | Veracity ID |

**Query:**
```graphql
query {
  userProfile(userId: "user123") {
    data {
      id
      name
      email
      role
      company
    }
  }
}
```

**Return Type:** `ApiResponse<UserProfileDetailsResponse>`

---

### 3. masterSiteList
Get master site list

**Query:**
```graphql
query {
  masterSiteList {
    data {
      id
      siteName
      location
      country
    }
  }
}
```

**Return Type:** `ApiResponse<List<SiteDetailsResponse>>`

---

### 4. masterServiceList
Get master service list

**Query:**
```graphql
query {
  masterServiceList {
    data {
      id
      serviceName
      description
    }
  }
}
```

**Return Type:** `ApiResponse<List<ServiceDetailsResponse>>`

---

### 5. viewCertificationQuicklinkCard
Get certification quicklink card

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| filter | OverviewFilter | Filter criteria |

**Query:**
```graphql
query {
  viewCertificationQuicklinkCard(filter: {
    companyId: 1
    serviceId: 1
    siteId: 1
  }) {
    data {
      total
      active
      expiring
      expired
    }
  }
}
```

**Return Type:** `ApiResponse<OverviewCardResponse>`

---

### 6. overviewCompanyServiceSiteFilter
Get overview filters

**Query:**
```graphql
query {
  overviewCompanyServiceSiteFilter {
    data {
      companies {
        id
        name
      }
      services {
        id
        name
      }
      sites {
        id
        name
      }
    }
  }
}
```

**Return Type:** `ApiResponse<List<OverviewCompanyServiceSiteFilterResult>>`

---

### 7. getWidgetforFinancials
Get financial widget data

**Query:**
```graphql
query {
  getWidgetforFinancials {
    data {
      totalInvoices
      paidInvoices
      pendingInvoices
      overdueInvoices
    }
  }
}
```

**Return Type:** `ApiResponse<List<WidgetFinancialStatusResponse>>`

---

### 8. widgetforTrainingStatus
Get training status widget

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| userId | string? | User ID |

**Query:**
```graphql
query {
  widgetforTrainingStatus(userId: "user123") {
    data {
      completedTrainings
      pendingTrainings
      expiringTrainings
    }
  }
}
```

**Return Type:** `ApiResponse<WidgetTrainingDataResponse>`

---

### 9. getWidgetForUpcomingAudit
Get upcoming audit widget

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| startDate | DateTime? | Start date |
| endDate | DateTime? | End date |

**Query:**
```graphql
query {
  getWidgetForUpcomingAudit(
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  ) {
    data {
      auditId
      auditName
      scheduledDate
      site
    }
  }
}
```

**Return Type:** `ApiResponse<List<UpcomingAuditResponse>>`

---

### 10. preferences
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
    objectType: "Contract"
    objectName: "ContractList"
    pageName: "Contracts"
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

### 1. createContract
Create a new contract

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateContractDto | Contract creation data |

**Mutation:**
```graphql
mutation {
  createContract(input: {
    contractName: "Audit Services Contract"
    vendorName: "Vendor Name"
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  }) {
    id
    contractName
    status
  }
}
```

**Return Type:** `ContractDto`

---

### 2. updateContract
Update contract

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateContractDto | Contract update data |

**Mutation:**
```graphql
mutation {
  updateContract(input: {
    id: 1
    contractName: "Updated Audit Services Contract"
    endDate: "2025-12-31"
  }) {
    id
    contractName
    status
  }
}
```

**Return Type:** `ContractDto`

---

### 3. deleteContract
Delete contract

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| contractId | int | Contract ID to delete |

**Mutation:**
```graphql
mutation {
  deleteContract(contractId: 1)
}
```

**Return Type:** `bool`

---

### 4. changeContractStatus
Change contract status

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| contractId | int | Contract ID |
| newStatus | string | New status (e.g., "Active", "Inactive", "Expired") |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  changeContractStatus(
    contractId: 1
    newStatus: "Active"
    modifiedBy: 123
  ) {
    id
    contractName
    status
  }
}
```

**Return Type:** `ContractDto`

---

### 5. renewContract
Renew contract

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| contractId | int | Contract ID |
| newEndDate | DateTime? | New end date |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  renewContract(
    contractId: 1
    newEndDate: "2026-12-31"
    modifiedBy: 123
  ) {
    id
    contractName
    endDate
    status
  }
}
```

**Return Type:** `ContractDto`

---

## cURL Examples

### Query: Validate User
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { validateUser(userId: \"user123\") { data { isValid userId role } } }"
  }'
```

### Query: Get User Profile
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { userProfile(userId: \"user123\") { data { id name email role } } }"
  }'
```

### Query: Get Master Site List
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { masterSiteList { data { id siteName location } } }"
  }'
```

### Query: Get Financial Widget Data
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getWidgetforFinancials { data { totalInvoices paidInvoices pendingInvoices } } }"
  }'
```

### Mutation: Create Contract
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createContract(input: { contractName: \"Audit Services Contract\", vendorName: \"Vendor Name\", startDate: \"2024-01-01\", endDate: \"2024-12-31\" }) { id contractName status } }"
  }'
```

### Mutation: Update Contract
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateContract(input: { id: 1, contractName: \"Updated Contract\" }) { id contractName status } }"
  }'
```

### Mutation: Change Contract Status
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { changeContractStatus(contractId: 1, newStatus: \"Active\", modifiedBy: 123) { id contractName status } }"
  }'
```

### Mutation: Renew Contract
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { renewContract(contractId: 1, newEndDate: \"2026-12-31\", modifiedBy: 123) { id contractName endDate } }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "userProfile": {
      "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
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
- Contract status values: "Active", "Inactive", "Expired", "Cancelled", "Pending"
