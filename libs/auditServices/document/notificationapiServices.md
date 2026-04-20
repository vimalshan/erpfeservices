# Notification API Services Documentation

## Service Overview

**Service Name:** notificationapiServices  
**Description:** Manages notifications and notification tracking  
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

### 1. notifications
Get notifications with filtering and pagination

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| category | List<int>? | Category IDs to filter |
| company | List<int>? | Company IDs to filter |
| service | List<int>? | Service IDs to filter |
| site | List<int>? | Site IDs to filter |
| pageNumber | int | Page number (default: 1) |
| pageSize | int | Page size (default: 10) |

**Query:**
```graphql
query {
  notifications(
    category: [1, 2]
    company: [1]
    pageNumber: 1
    pageSize: 10
  ) {
    data {
      id
      title
      message
      category
      createdDate
      isRead
    }
    pageInfo {
      pageNumber
      pageSize
      totalCount
    }
  }
}
```

**Return Type:** `ApiResponse<NotificationPaginationResponse>`

---

### 2. categoriesFilter
Filter categories

**Query:**
```graphql
query {
  categoriesFilter {
    data {
      id
      name
      count
    }
  }
}
```

**Return Type:** `ApiResponse<List<NotificationFilterItem>>`

---

### 3. servicesFilter
Filter services

**Query:**
```graphql
query {
  servicesFilter {
    data {
      id
      name
      count
    }
  }
}
```

**Return Type:** `ApiResponse<List<NotificationFilterItem>>`

---

### 4. companiesFilter
Filter companies

**Query:**
```graphql
query {
  companiesFilter {
    data {
      id
      name
      count
    }
  }
}
```

**Return Type:** `ApiResponse<List<NotificationFilterItem>>`

---

### 5. sitesFilter
Filter sites

**Query:**
```graphql
query {
  sitesFilter {
    data {
      id
      name
      count
    }
  }
}
```

**Return Type:** `ApiResponse<List<NotificationSiteNode>>`

---

## GraphQL Mutations

### 1. createNotification
Create a new notification

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateNotificationDto | Notification creation data |

**Mutation:**
```graphql
mutation {
  createNotification(input: {
    title: "System Notification"
    message: "Important system update scheduled"
    categoryId: 1
    companyId: 1
    serviceId: 1
    siteId: 1
  }) {
    id
    title
    message
    createdDate
  }
}
```

**Return Type:** `NotificationDto`

---

### 2. updateNotification
Update notification

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateNotificationDto | Notification update data |

**Mutation:**
```graphql
mutation {
  updateNotification(input: {
    id: 1
    title: "Updated System Notification"
    message: "Updated notification message"
  }) {
    id
    title
    message
  }
}
```

**Return Type:** `NotificationDto`

---

### 3. deleteNotification
Delete notification

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| notificationId | int | Notification ID to delete |

**Mutation:**
```graphql
mutation {
  deleteNotification(notificationId: 1)
}
```

**Return Type:** `bool`

---

### 4. markNotificationRead
Mark notification as read

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| notificationId | int | Notification ID |
| userId | int | User ID |

**Mutation:**
```graphql
mutation {
  markNotificationRead(
    notificationId: 1
    userId: 123
  ) {
    id
    title
    isRead
    readDate
  }
}
```

**Return Type:** `NotificationDto`

---

### 5. archiveNotification
Archive notification

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| notificationId | int | Notification ID |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  archiveNotification(
    notificationId: 1
    modifiedBy: 123
  ) {
    id
    title
    isArchived
  }
}
```

**Return Type:** `NotificationDto`

---

### 6. createNotificationCategory
Create notification category

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateNotificationCategoryDto | Category creation data |

**Mutation:**
```graphql
mutation {
  createNotificationCategory(input: {
    name: "System Updates"
    description: "Notifications for system updates"
  }) {
    id
    name
    description
  }
}
```

**Return Type:** `NotificationCategoryDto`

---

## cURL Examples

### Query: Get All Notifications
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { notifications(pageNumber: 1, pageSize: 10) { data { id title message isRead } pageInfo { totalCount } } }"
  }'
```

### Query: Get Notifications with Filters
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { notifications(category: [1], company: [1], pageNumber: 1, pageSize: 10) { data { id title message } pageInfo { totalCount } } }"
  }'
```

### Query: Filter Categories
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { categoriesFilter { data { id name count } } }"
  }'
```

### Query: Filter Companies
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { companiesFilter { data { id name count } } }"
  }'
```

### Mutation: Create Notification
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createNotification(input: { title: \"System Notification\", message: \"Important update\", categoryId: 1 }) { id title message createdDate } }"
  }'
```

### Mutation: Update Notification
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateNotification(input: { id: 1, title: \"Updated Title\", message: \"Updated message\" }) { id title message } }"
  }'
```

### Mutation: Mark as Read
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { markNotificationRead(notificationId: 1, userId: 123) { id title isRead } }"
  }'
```

### Mutation: Archive Notification
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { archiveNotification(notificationId: 1, modifiedBy: 123) { id title isArchived } }"
  }'
```

### Mutation: Delete Notification
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deleteNotification(notificationId: 1) }"
  }'
```

### Mutation: Create Notification Category
```bash
curl -X POST http://localhost:5007/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createNotificationCategory(input: { name: \"System Updates\", description: \"System update notifications\" }) { id name description } }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "notifications": {
      "data": [
        {
          "id": 1,
          "title": "System Notification",
          "message": "Important system update scheduled",
          "isRead": false,
          "createdDate": "2024-01-15T10:30:00Z"
        }
      ],
      "pageInfo": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalCount": 5
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
      "message": "Notification not found",
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
- Use `http://localhost:5007` for local development
- All timestamps are in ISO 8601 format
- Pagination is 1-indexed (pageNumber starts at 1)
- Notifications can be filtered by category, company, service, or site
- Archive notifications for long-term record keeping without deletion
