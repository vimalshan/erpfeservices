# Action API Services Documentation

## Service Overview

**Service Name:** actionapiServices  
**Description:** Manages audit actions and action tracking  
**Base URL:** http://localhost:5007  
**Port:** 5007  
**Apollo Client:** `notification` → `notificationGraphqlHost`

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. allActions
Get all actions

**Query:**
```graphql
query {
  allActions {
    id
    # Add additional fields as needed
  }
}
```

**Return Type:** `IEnumerable<ActionDto>`

---

### 2. actionById
Get action by ID

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Action ID |

**Query:**
```graphql
query {
  actionById(id: 1) {
    id
    # Add additional fields as needed
  }
}
```

**Return Type:** `ActionDto?`

---

### 3. actionsByEntity
Get actions by entity type and ID

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| entityType | string | Entity type filter |
| entityId | int | Entity ID |

**Query:**
```graphql
query {
  actionsByEntity(entityType: "audit", entityId: 1) {
    id
    # Add additional fields as needed
  }
}
```

**Return Type:** `IEnumerable<ActionDto>`

---

### 4. actions
Paginated actions with filtering

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| category | List<int>? | Category IDs to filter |
| company | List<int>? | Company IDs to filter |
| service | List<int>? | Service IDs to filter |
| site | List<int>? | Site IDs to filter |
| isHighPriority | bool | Filter by priority |
| pageNumber | int | Page number (default: 1) |
| pageSize | int | Page size (default: 10) |

**Query:**
```graphql
query {
  actions(
    category: [1, 2]
    company: [1]
    service: [1]
    site: [1]
    isHighPriority: false
    pageNumber: 1
    pageSize: 10
  ) {
    data {
      id
      # Add additional fields
    }
    pageInfo {
      pageNumber
      pageSize
      totalCount
    }
  }
}
```

**Return Type:** `ApiResponse<ActionsPaginationResponse>`

---

### 5. actionCategoriesFilter
Filter action categories

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| companies | List<int>? | Company IDs |
| services | List<int>? | Service IDs |
| sites | List<int>? | Site IDs |

**Query:**
```graphql
query {
  actionCategoriesFilter(
    companies: [1]
    services: [1]
    sites: [1]
  ) {
    data {
      id
      name
    }
  }
}
```

**Return Type:** `ApiResponse<List<ActionFilterItem>>`

---

### 6. actionCompaniesFilter
Filter action companies

**Query:**
```graphql
query {
  actionCompaniesFilter {
    data {
      id
      name
    }
  }
}
```

**Return Type:** `ApiResponse<List<ActionFilterItem>>`

---

### 7. actionServicesFilter
Filter action services

**Query:**
```graphql
query {
  actionServicesFilter {
    data {
      id
      name
    }
  }
}
```

**Return Type:** `ApiResponse<List<ActionFilterItem>>`

---

### 8. actionSitesFilter
Filter action sites

**Query:**
```graphql
query {
  actionSitesFilter {
    data {
      id
      name
    }
  }
}
```

**Return Type:** `ApiResponse<List<ActionSiteNode>>`

---

## GraphQL Mutations

### 1. createAction
Create a new action

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateActionDto | Action creation data |

**Mutation:**
```graphql
mutation {
  createAction(input: {
    title: "Action Title"
    description: "Description"
    categoryId: 1
    companyId: 1
    serviceId: 1
    siteId: 1
    isHighPriority: false
  }) {
    id
    title
    # Add additional fields as needed
  }
}
```

**Return Type:** `ActionDto`

---

### 2. updateAction
Update an existing action

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateActionDto | Action update data |

**Mutation:**
```graphql
mutation {
  updateAction(input: {
    id: 1
    title: "Updated Title"
    description: "Updated Description"
    categoryId: 1
    companyId: 1
    serviceId: 1
    siteId: 1
    isHighPriority: true
  }) {
    id
    title
    # Add additional fields as needed
  }
}
```

**Return Type:** `ActionDto`

---

### 3. deleteAction
Delete an action

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Action ID to delete |

**Mutation:**
```graphql
mutation {
  deleteAction(id: 1)
}
```

**Return Type:** `bool`

---

### 4. completeAction
Mark action as complete

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Action ID to complete |

**Mutation:**
```graphql
mutation {
  completeAction(id: 1)
}
```

**Return Type:** `bool`

---

## cURL Examples

### Query: Get All Actions
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { allActions { id } }"
  }'
```

### Query: Get Action by ID
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { actionById(id: 1) { id title description } }"
  }'
```

### Query: Get Paginated Actions with Filters
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { actions(category: [1], company: [1], pageNumber: 1, pageSize: 10) { data { id title } pageInfo { totalCount } } }"
  }'
```

### Mutation: Create Action
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createAction(input: { title: \"New Action\", categoryId: 1, companyId: 1 }) { id title } }"
  }'
```

### Mutation: Update Action
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateAction(input: { id: 1, title: \"Updated Action\" }) { id title } }"
  }'
```

### Mutation: Delete Action
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deleteAction(id: 1) }"
  }'
```

### Mutation: Complete Action
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { completeAction(id: 1) }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "actionById": {
      "id": 1,
      "title": "Action Title",
      "description": "Description"
    }
  }
}
```

### Error Response
```json
{
  "errors": [
    {
      "message": "Error message",
      "extensions": {
        "code": "ERROR_CODE"
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
- Use `http://localhost:5007` for local development
- All timestamps are in ISO 8601 format
- Pagination is 1-indexed (pageNumber starts at 1)
