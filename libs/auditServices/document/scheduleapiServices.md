# Schedule API Services Documentation

## Service Overview

**Service Name:** scheduleapiServices  
**Description:** Manages audit schedules and scheduling  
**Base URL:** http://localhost:5008  
**Port:** 5008  
**Apollo Client:** `schedule` → `scheduleGraphqlHost`

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. viewAuditSchedules
Get audit schedules

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| calendarScheduleFilter | CalendarScheduleFilterInput | Filter criteria |

**Query:**
```graphql
query {
  viewAuditSchedules(calendarScheduleFilter: {
    startDate: "2024-01-01"
    endDate: "2024-12-31"
    companies: [1]
    services: [1]
    sites: [1]
  }) {
    data {
      id
      auditName
      scheduledDate
      site
      auditor
      status
    }
  }
}
```

**Return Type:** `ApiResponse<List<AuditScheduleResponse>>`

---

### 2. addToCalender
Get calendar invite for schedule

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| isAddToCalender | bool | Whether to add to calendar |
| siteAuditId | int | Site audit ID |

**Query:**
```graphql
query {
  addToCalender(
    isAddToCalender: true
    siteAuditId: 1
  ) {
    data {
      calendarUrl
      iCalData
      eventTitle
      eventDescription
    }
  }
}
```

**Return Type:** `ApiResponse<CalendarResponse>`

---

## GraphQL Mutations

### 1. scheduleAudit
Schedule an audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateAuditSiteAuditDto | Schedule creation data |

**Mutation:**
```graphql
mutation {
  scheduleAudit(input: {
    auditId: 1
    siteId: 1
    scheduledDate: "2024-06-15"
    auditorId: 123
    estimatedDays: 5
    notes: "Audit scheduled for Q2 2024"
  }) {
    id
    auditId
    siteId
    scheduledDate
    status
  }
}
```

**Return Type:** `AuditSiteAuditDto`

---

### 2. updateSchedule
Update schedule

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateAuditSiteAuditDto | Schedule update data |

**Mutation:**
```graphql
mutation {
  updateSchedule(input: {
    id: 1
    scheduledDate: "2024-06-20"
    auditorId: 124
    estimatedDays: 6
    notes: "Updated schedule"
  }) {
    id
    auditId
    siteId
    scheduledDate
    status
  }
}
```

**Return Type:** `AuditSiteAuditDto`

---

### 3. deleteSchedule
Delete schedule

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditSiteAuditId | int | Schedule ID to delete |

**Mutation:**
```graphql
mutation {
  deleteSchedule(auditSiteAuditId: 1)
}
```

**Return Type:** `bool`

---

### 4. rescheduleAudit
Reschedule audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditSiteAuditId | int | Schedule ID |
| newDate | DateTime? | New date |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  rescheduleAudit(
    auditSiteAuditId: 1
    newDate: "2024-07-15"
    modifiedBy: 123
  ) {
    id
    scheduledDate
    status
  }
}
```

**Return Type:** `AuditSiteAuditDto`

---

### 5. startAudit
Start audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditSiteAuditId | int | Schedule ID |
| startDate | DateTime | Audit start date |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  startAudit(
    auditSiteAuditId: 1
    startDate: "2024-06-15"
    modifiedBy: 123
  ) {
    id
    startDate
    status
  }
}
```

**Return Type:** `AuditSiteAuditDto`

---

### 6. completeAudit
Complete audit

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| auditSiteAuditId | int | Schedule ID |
| completedDate | DateTime | Completion date |
| reportPath | string? | Path to audit report |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  completeAudit(
    auditSiteAuditId: 1
    completedDate: "2024-06-20"
    reportPath: "/reports/audit-2024-001.pdf"
    modifiedBy: 123
  ) {
    id
    completedDate
    status
    reportPath
  }
}
```

**Return Type:** `AuditSiteAuditDto`

---

## cURL Examples

### Query: View Audit Schedules
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { viewAuditSchedules(calendarScheduleFilter: { startDate: \"2024-01-01\", endDate: \"2024-12-31\" }) { data { id auditName scheduledDate site status } } }"
  }'
```

### Query: View Audit Schedules with Filters
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { viewAuditSchedules(calendarScheduleFilter: { startDate: \"2024-01-01\", endDate: \"2024-12-31\", companies: [1], services: [1] }) { data { id auditName scheduledDate site } } }"
  }'
```

### Query: Get Calendar Invite
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { addToCalender(isAddToCalender: true, siteAuditId: 1) { data { calendarUrl eventTitle eventDescription } } }"
  }'
```

### Mutation: Schedule Audit
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { scheduleAudit(input: { auditId: 1, siteId: 1, scheduledDate: \"2024-06-15\", auditorId: 123, estimatedDays: 5 }) { id auditId siteId scheduledDate status } }"
  }'
```

### Mutation: Update Schedule
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateSchedule(input: { id: 1, scheduledDate: \"2024-06-20\", estimatedDays: 6 }) { id scheduledDate status } }"
  }'
```

### Mutation: Reschedule Audit
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { rescheduleAudit(auditSiteAuditId: 1, newDate: \"2024-07-15\", modifiedBy: 123) { id scheduledDate status } }"
  }'
```

### Mutation: Start Audit
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { startAudit(auditSiteAuditId: 1, startDate: \"2024-06-15\", modifiedBy: 123) { id startDate status } }"
  }'
```

### Mutation: Complete Audit
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { completeAudit(auditSiteAuditId: 1, completedDate: \"2024-06-20\", reportPath: \"/reports/audit.pdf\", modifiedBy: 123) { id completedDate status reportPath } }"
  }'
```

### Mutation: Delete Schedule
```bash
curl -X POST http://localhost:5008/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deleteSchedule(auditSiteAuditId: 1) }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "viewAuditSchedules": {
      "data": [
        {
          "id": 1,
          "auditName": "Q2 2024 Audit",
          "scheduledDate": "2024-06-15",
          "site": "Site A",
          "auditor": "John Auditor",
          "status": "Scheduled"
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
      "message": "Schedule not found",
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
- Use `http://localhost:5008` for local development
- All timestamps are in ISO 8601 format
- Schedule status values: "Scheduled", "In Progress", "Completed", "Cancelled", "Postponed"
- The calendar endpoint generates .ics formatted data compatible with most calendar applications
- Audit schedules should include estimated days for resource planning
