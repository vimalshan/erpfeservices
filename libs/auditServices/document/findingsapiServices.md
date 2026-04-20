# Findings API Services Documentation

## Service Overview

**Service Name:** findingsapiServices  
**Description:** Manages audit findings and findings tracking  
**Base URL:** http://localhost:5006  
**Port:** 5006  
**Apollo Client:** `finding` → `findingGraphqlHost`

---

## REST Endpoints

### 1. Get All Companies
- **Method:** GET
- **Path:** `/api/companies`
- **Description:** Get all companies
- **Authentication:** Bearer Token
- **Response:** List of companies

### 2. Get All Findings
- **Method:** GET
- **Path:** `/api/findings`
- **Description:** Get all findings with optional filters
- **Authentication:** Bearer Token
- **Query Parameters:** 
  - `companyId` (int, optional)
  - `status` (string, optional)
  - `category` (string, optional)

### 3. Search Findings
- **Method:** GET
- **Path:** `/api/findings/search`
- **Description:** Search findings by text
- **Authentication:** Bearer Token
- **Query Parameters:**
  - `searchTerm` (string, required)
  - `searchIn` (string, optional - "All", "Title", "Description")

### 4. Update Finding
- **Method:** PUT
- **Path:** `/api/findings/{id}`
- **Description:** Update finding by ID
- **Authentication:** Bearer Token
- **Request Body:** Finding update data

### 5. Close Finding
- **Method:** POST
- **Path:** `/api/findings/{id}/close`
- **Description:** Close finding by ID
- **Authentication:** Bearer Token
- **Request Body:** Closure details

### 6. Bulk Update Findings Status
- **Method:** POST
- **Path:** `/api/findings/bulk-status`
- **Description:** Bulk update findings status
- **Authentication:** Bearer Token
- **Request Body:** List of finding IDs and new status

### 7. GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## REST Examples

### Get All Companies
```bash
curl -X GET http://localhost:5006/api/companies \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Get All Findings
```bash
curl -X GET http://localhost:5006/api/findings \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Get Findings with Filters
```bash
curl -X GET "http://localhost:5006/api/findings?companyId=1&status=Open" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Search Findings
```bash
curl -X GET "http://localhost:5006/api/findings/search?searchTerm=critical&searchIn=Title" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Update Finding
```bash
curl -X PUT http://localhost:5006/api/findings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "title": "Updated Finding Title",
    "severity": "High",
    "status": "In Progress"
  }'
```

### Close Finding
```bash
curl -X POST http://localhost:5006/api/findings/1/close \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "closureNotes": "Finding has been remediated and verified."
  }'
```

### Bulk Update Findings Status
```bash
curl -X POST http://localhost:5006/api/findings/bulk-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "findingIds": [1, 2, 3],
    "newStatus": "Closed"
  }'
```

---

## GraphQL Queries

### 1. getFindings
Get all findings with optional filtering and pagination

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| companyId | int? | Company ID filter |
| status | string? | Status filter |
| category | string? | Category filter |

**Query:**
```graphql
query {
  getFindings(companyId: 1, status: "Open") {
    id
    findingNumber
    title
    severity
    status
    createdDate
  }
}
```

**Return Type:** `IEnumerable<Finding>`

---

### 2. getFinding
Get a specific finding by ID

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Finding ID |

**Query:**
```graphql
query {
  getFinding(id: 1) {
    id
    findingNumber
    title
    description
    severity
    status
    auditId
    createdDate
    dueDate
  }
}
```

**Return Type:** `Finding?`

---

### 3. getFindingsStatistics
Get findings statistics

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| companyId | int? | Company ID filter |

**Query:**
```graphql
query {
  getFindingsStatistics(companyId: 1) {
    data {
      totalFindings
      openFindings
      closedFindings
      overduFindings
      criticalFindings
    }
  }
}
```

**Return Type:** `FindingsStatistics`

---

### 4. searchFindings
Search findings by text

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| searchTerm | string | Search text |
| searchIn | SearchField | Search field (default: "All") |

**Query:**
```graphql
query {
  searchFindings(searchTerm: "critical", searchIn: "All") {
    id
    findingNumber
    title
    severity
    status
  }
}
```

**Return Type:** `IEnumerable<Finding>`

---

### 5. getCompanies
Get all companies

**Query:**
```graphql
query {
  getCompanies {
    id
    companyName
    location
  }
}
```

**Return Type:** `IEnumerable<Company>`

---

### 6. getCompany
Get company by ID

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Company ID |

**Query:**
```graphql
query {
  getCompany(id: 1) {
    id
    companyName
    location
    address
  }
}
```

**Return Type:** `Company?`

---

### 7. getSites
Get sites for a company

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| companyId | int | Company ID |

**Query:**
```graphql
query {
  getSites(companyId: 1) {
    id
    siteName
    location
  }
}
```

**Return Type:** `IEnumerable<Site>`

---

## GraphQL Mutations

### 1. createFinding
Create a new finding (Authorization: Auditor)

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateFindingInput | Finding creation data |

**Mutation:**
```graphql
mutation {
  createFinding(input: {
    title: "Critical Security Issue"
    description: "Detailed description of the finding"
    severity: "Critical"
    category: "Security"
    auditId: 1
    siteId: 1
    dueDate: "2024-06-01"
  }) {
    finding {
      id
      findingNumber
      title
      severity
    }
    success
    message
  }
}
```

**Return Type:** `CreateFindingPayload`  
**Authorization:** Auditor

---

### 2. updateFinding
Update an existing finding (Authorization: Auditor)

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateFindingInput | Finding update data |

**Mutation:**
```graphql
mutation {
  updateFinding(input: {
    id: 1
    title: "Updated Finding Title"
    description: "Updated description"
    severity: "High"
    status: "In Progress"
  }) {
    finding {
      id
      title
      severity
      status
    }
    success
    message
  }
}
```

**Return Type:** `UpdateFindingPayload`  
**Authorization:** Auditor

---

### 3. closeFinding
Close a finding (Authorization: Admin)

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| findingId | int | Finding ID |
| closureNotes | string | Closure notes |

**Mutation:**
```graphql
mutation {
  closeFinding(
    findingId: 1
    closureNotes: "Finding has been remediated and verified by management."
  ) {
    finding {
      id
      status
      closedDate
    }
    success
    message
  }
}
```

**Return Type:** `CloseFindingPayload`  
**Authorization:** Admin

---

### 4. bulkUpdateFindingsStatus
Bulk update findings status (Authorization: Admin)

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| findingIds | List<int> | List of finding IDs |

**Mutation:**
```graphql
mutation {
  bulkUpdateFindingsStatus(
    findingIds: [1, 2, 3]
  ) {
    updatedCount
    success
    message
  }
}
```

**Return Type:** `BulkUpdatePayload`  
**Authorization:** Admin

---

## cURL Examples

### Query: Get All Findings
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getFindings { id findingNumber title severity status } }"
  }'
```

### Query: Get Finding by ID
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getFinding(id: 1) { id findingNumber title description severity dueDate } }"
  }'
```

### Query: Search Findings
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { searchFindings(searchTerm: \"critical\", searchIn: \"Title\") { id findingNumber title } }"
  }'
```

### Query: Get Findings Statistics
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getFindingsStatistics(companyId: 1) { data { totalFindings openFindings closedFindings } } }"
  }'
```

### Mutation: Create Finding
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createFinding(input: { title: \"Critical Issue\", severity: \"Critical\", category: \"Security\", auditId: 1 }) { finding { id findingNumber title } success message } }"
  }'
```

### Mutation: Update Finding
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateFinding(input: { id: 1, title: \"Updated Title\", severity: \"High\" }) { finding { id title severity } success message } }"
  }'
```

### Mutation: Close Finding
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { closeFinding(findingId: 1, closureNotes: \"Finding has been remediated.\") { finding { id status closedDate } success message } }"
  }'
```

### Mutation: Bulk Update Findings Status
```bash
curl -X POST http://localhost:5006/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { bulkUpdateFindingsStatus(findingIds: [1, 2, 3]) { updatedCount success message } }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "getFindings": [
      {
        "id": 1,
        "findingNumber": "FND-2024-001",
        "title": "Critical Security Issue",
        "severity": "Critical",
        "status": "Open"
      }
    ]
  }
}
```

### Error Response
```json
{
  "errors": [
    {
      "message": "Finding not found",
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
- Use `http://localhost:5006` for local development
- All timestamps are in ISO 8601 format
- Finding status values: "Open", "In Progress", "Closed", "On Hold"
- Severity levels: "Critical", "High", "Medium", "Low"
- Authorization is required for mutations: Auditor role for create/update, Admin role for close/bulk operations
