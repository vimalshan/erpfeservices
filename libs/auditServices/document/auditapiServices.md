# Audit API Services Documentation

## Service Overview

**Service Name:** auditapiServices  
**Description:** Manages audit operations and audit tracking  
**Base URL:** http://localhost:5003  
**Port:** 5003  
**Apollo Client:** `audit` → `auditGraphqlHost`

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. viewAudits
Get list of audits

**Query:**
```graphql
query {
  viewAudits {
    data {
      id
      auditName
      status
    }
  }
}
```

**Return Type:** `ApiResponse<List<AuditListResponse>>`

---

### 2. auditDetails
Get detailed audit information

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditId | int | Audit ID |

**Query:**
```graphql
query {
  auditDetails(auditId: 1) {
    data {
      id
      auditName
      status
      startDate
      endDate
    }
  }
}
```

**Return Type:** `ApiResponse<AuditDetailResponse>`

---

### 3. viewFindings
Get findings for an audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditId | int | Audit ID |

**Query:**
```graphql
query {
  viewFindings(auditId: 1) {
    data {
      id
      findingNumber
      status
      severity
    }
  }
}
```

**Return Type:** `ApiResponse<List<AuditFindingListResponse>>`

---

### 4. viewSitesForAudit
Get sites in an audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditId | int | Audit ID |

**Query:**
```graphql
query {
  viewSitesForAudit(auditId: 1) {
    data {
      id
      siteName
      location
    }
  }
}
```

**Return Type:** `ApiResponse<List<AuditSiteResponse>>`

---

### 5. viewSubAudits
Get sub-audits

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditId | int | Audit ID |

**Query:**
```graphql
query {
  viewSubAudits(auditId: 1) {
    data {
      id
      subAuditName
      status
    }
  }
}
```

**Return Type:** `ApiResponse<List<SubAuditResponse>>`

---

### 6. getAuditDaysPerSite
Get audit days grid per site

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| startDate | string | Start date (ISO 8601) |
| endDate | string | End date (ISO 8601) |
| companies | List<int>? | Company IDs filter |
| services | List<int>? | Service IDs filter |
| sites | List<int>? | Site IDs filter |

**Query:**
```graphql
query {
  getAuditDaysPerSite(
    startDate: "2024-01-01"
    endDate: "2024-12-31"
    companies: [1]
    services: [1]
    sites: [1]
  ) {
    data {
      gridData {
        date
        auditDays
      }
    }
  }
}
```

**Return Type:** `ApiResponse<AuditDaysGridResponse>`

---

### 7. auditDaysbyServicePieChart
Get audit days pie chart data

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| filters | AuditDaysFilter | Filter criteria |

**Query:**
```graphql
query {
  auditDaysbyServicePieChart(filters: {
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  }) {
    data {
      serviceName
      auditDays
    }
  }
}
```

**Return Type:** `ApiResponse<AuditDaysByServiceResponse>`

---

### 8. getAuditDaysByMonthAndService
Get audit days by month and service

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| startDate | string | Start date (ISO 8601) |
| endDate | string | End date (ISO 8601) |
| companyFilter | List<int>? | Company IDs |
| serviceFilter | List<int>? | Service IDs |
| siteFilter | List<int>? | Site IDs |

**Query:**
```graphql
query {
  getAuditDaysByMonthAndService(
    startDate: "2024-01-01"
    endDate: "2024-12-31"
    companyFilter: [1]
    serviceFilter: [1]
    siteFilter: [1]
  ) {
    data {
      month
      service
      auditDays
    }
  }
}
```

**Return Type:** `ApiResponse<AuditDaysByMonthAndServiceResponse>`

---

## GraphQL Mutations

### 1. createAudit
Create a new audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateAuditDto | Audit creation data |

**Mutation:**
```graphql
mutation {
  createAudit(input: {
    auditName: "Audit 2024"
    auditType: "Internal"
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  }) {
    id
    auditName
    status
  }
}
```

**Return Type:** `AuditDto`

---

### 2. updateAudit
Update an audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateAuditDto | Audit update data |

**Mutation:**
```graphql
mutation {
  updateAudit(input: {
    id: 1
    auditName: "Updated Audit 2024"
    auditType: "External"
  }) {
    id
    auditName
    status
  }
}
```

**Return Type:** `AuditDto`

---

### 3. deleteAudit
Delete an audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Audit ID to delete |

**Mutation:**
```graphql
mutation {
  deleteAudit(id: 1)
}
```

**Return Type:** `bool`

---

### 4. changeAuditStatus
Change audit status

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditId | int | Audit ID |
| newStatus | string | New status (e.g., "Planned", "In Progress", "Completed") |

**Mutation:**
```graphql
mutation {
  changeAuditStatus(
    auditId: 1
    newStatus: "In Progress"
  )
}
```

**Return Type:** `bool`

---

## cURL Examples

### Query: View All Audits
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { viewAudits { data { id auditName status } } }"
  }'
```

### Query: Get Audit Details
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { auditDetails(auditId: 1) { data { id auditName status startDate endDate } } }"
  }'
```

### Query: Get Findings for Audit
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { viewFindings(auditId: 1) { data { id findingNumber status severity } } }"
  }'
```

### Query: Get Sites for Audit
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { viewSitesForAudit(auditId: 1) { data { id siteName location } } }"
  }'
```

### Query: Get Audit Days per Site
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getAuditDaysPerSite(startDate: \"2024-01-01\", endDate: \"2024-12-31\") { data { gridData { date auditDays } } } }"
  }'
```

### Mutation: Create Audit
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createAudit(input: { auditName: \"New Audit\", auditType: \"Internal\" }) { id auditName status } }"
  }'
```

### Mutation: Update Audit
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateAudit(input: { id: 1, auditName: \"Updated Audit\" }) { id auditName status } }"
  }'
```

### Mutation: Change Audit Status
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { changeAuditStatus(auditId: 1, newStatus: \"In Progress\") }"
  }'
```

### Mutation: Delete Audit
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deleteAudit(id: 1) }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "viewAudits": {
      "data": [
        {
          "id": 1,
          "auditName": "Audit 2024",
          "status": "In Progress"
        }
      ]
    }
  }
}
```

### Error Response
```json
{
  "errors": [
    {
      "message": "Audit not found",
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
- Use `http://localhost:5003` for local development
- All timestamps are in ISO 8601 format
- Status values: "Planned", "In Progress", "Completed", "Cancelled"
