# Overview API Services Documentation

## Service Overview

**Service Name:** overviewapiServices  
**Description:** Manages dashboard overview widgets including certification cards, financial status, upcoming audits, and training status  
**Base URL:** http://localhost:5004  
**Port:** 5004  
**Apollo Client:** `contact` → `contactGraphqlHost`

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. viewCertificationQuicklinkCard
Get certification overview card data with pagination

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| pageNumber | Int! | Page number |
| pageSize | Int! | Page size |
| filter | QuickLinkCardRequestInput! | Filter criteria (company, service, site) |

**Query:**
```graphql
query GetOverviewCardData($pageNumber: Int!, $pageSize: Int!, $filter: QuickLinkCardRequestInput!) {
  viewCertificationQuicklinkCard(pageNumber: $pageNumber, pageSize: $pageSize, filter: $filter) {
    data {
      currentPage
      data {
        serviceId
        serviceName
        yearData {
          year
          values {
            count
            seq
            statusValue
            totalCount
          }
        }
      }
      totalItems
      totalPages
    }
    isSuccess
    message
    errorCode
  }
}
```

**Return Type:** `ApiResponse<CertificationQuicklinkCardData>`

---

### 2. viewCertificationQuicklinkCard (without pagination)
Get all certification overview card data

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| filter | QuickLinkCardRequestInput! | Filter criteria |

**Query:**
```graphql
query GetOverviewCardData($filter: QuickLinkCardRequestInput!) {
  viewCertificationQuicklinkCard(filter: $filter) {
    data {
      data {
        serviceId
        serviceName
        yearData {
          year
          values {
            count
            seq
            statusValue
            totalCount
          }
        }
      }
      totalItems
    }
    isSuccess
    message
    errorCode
  }
}
```

**Return Type:** `ApiResponse<CertificationQuicklinkCardData>`

---

### 3. getWidgetforFinancials
Get financial status widget data

**Query:**
```graphql
query GetOverviewFinancialStatus {
  getWidgetforFinancials {
    isSuccess
    message
    errorCode
    data {
      financialStatus
      financialCount
      financialpercentage
    }
  }
}
```

**Return Type:** `ApiResponse<List<FinancialStatusItem>>`

---

### 4. getWidgetForUpcomingAudit
Get upcoming audit widget data

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| month | Int | Month filter |
| year | Int | Year filter |

**Query:**
```graphql
query GetWidgetForUpcomingAudit($month: Int, $year: Int) {
  getWidgetForUpcomingAudit(month: $month, year: $year) {
    isSuccess
    message
    errorCode
    data {
      confirmed
      toBeConfirmed
      toBeConfirmedBySuaadhya
    }
  }
}
```

**Return Type:** `ApiResponse<UpcomingAuditWidgetData>`

---

### 5. widgetforTrainingStatus
Get training status widget data

**Query:**
```graphql
query {
  widgetforTrainingStatus {
    isSuccess
    message
    errorCode
    data {
      trainingData {
        trainingName
        trainingStatus
        trainingDueDate
        trainingLocation
      }
    }
  }
}
```

**Return Type:** `ApiResponse<TrainingStatusData>`

---

### 6. overviewCompanyServiceSiteFilter
Get overview filter values (company/service/site mapping)

**Query:**
```graphql
query FEoverviewCompanyServiceSiteFilter {
  overviewCompanyServiceSiteFilter {
    data {
      companyId
      serviceId
      siteId
    }
    isSuccess
    message
    errorCode
  }
}
```

**Return Type:** `ApiResponse<List<OverviewCompanyServiceSiteFilterResult>>`

---

### 7. certificateCompaniesFilter
Get companies filter for overview

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| services | [Int!] | Service IDs filter |
| sites | [Int!] | Site IDs filter |

**Query:**
```graphql
query GetOverviewFilterCompanies($services: [Int!], $sites: [Int!]) {
  certificateCompaniesFilter(services: $services, sites: $sites) {
    data {
      id
      label
    }
    isSuccess
    message
    errorCode
  }
}
```

**Return Type:** `ApiResponse<List<FilterItem>>`

---

### 8. certificateServicesFilter
Get services filter for overview

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| companies | [Int!] | Company IDs filter |
| sites | [Int!] | Site IDs filter |

**Query:**
```graphql
query GetOverviewFilterServices($companies: [Int!], $sites: [Int!]) {
  certificateServicesFilter(companies: $companies, sites: $sites) {
    data {
      id
      label
    }
    isSuccess
    message
    errorCode
  }
}
```

**Return Type:** `ApiResponse<List<FilterItem>>`

---

### 9. certificationSitesFilter
Get sites filter for overview

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| companies | [Int!] | Company IDs filter |
| services | [Int!] | Service IDs filter |

**Query:**
```graphql
query GetOverviewFilterSites($companies: [Int!], $services: [Int!]) {
  certificationSitesFilter(companies: $companies, services: $services) {
    data {
      id
      label
      children {
        id
        label
        children {
          id
          label
        }
      }
    }
    isSuccess
    message
    errorCode
  }
}
```

**Return Type:** `ApiResponse<List<SiteFilterNode>>`

---

## cURL Examples

### Query: Get Certification Overview Card Data
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query GetOverviewCardData($pageNumber: Int!, $pageSize: Int!, $filter: QuickLinkCardRequestInput!) { viewCertificationQuicklinkCard(pageNumber: $pageNumber, pageSize: $pageSize, filter: $filter) { data { currentPage data { serviceId serviceName yearData { year values { count seq statusValue totalCount } } } totalItems totalPages } isSuccess message } }",
    "variables": {
      "pageNumber": 1,
      "pageSize": 10,
      "filter": {
        "companyFilter": [1],
        "serviceFilter": [1],
        "siteFilter": [1]
      }
    }
  }'
```

### Query: Get Financial Status Widget
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { getWidgetforFinancials { isSuccess message data { financialStatus financialCount financialpercentage } } }"
  }'
```

### Query: Get Upcoming Audit Widget
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query GetWidgetForUpcomingAudit($month: Int, $year: Int) { getWidgetForUpcomingAudit(month: $month, year: $year) { isSuccess message data { confirmed toBeConfirmed toBeConfirmedBySuaadhya } } }",
    "variables": {
      "month": 6,
      "year": 2024
    }
  }'
```

### Query: Get Training Status Widget
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { widgetforTrainingStatus { isSuccess message data { trainingData { trainingName trainingStatus trainingDueDate trainingLocation } } } }"
  }'
```

### Query: Get Overview Filter Values
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { overviewCompanyServiceSiteFilter { data { companyId serviceId siteId } isSuccess message } }"
  }'
```

### Query: Get Companies Filter
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query GetOverviewFilterCompanies($services: [Int!], $sites: [Int!]) { certificateCompaniesFilter(services: $services, sites: $sites) { data { id label } isSuccess message } }",
    "variables": {
      "services": [1, 2],
      "sites": [1]
    }
  }'
```

### Query: Get Services Filter
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query GetOverviewFilterServices($companies: [Int!], $sites: [Int!]) { certificateServicesFilter(companies: $companies, sites: $sites) { data { id label } isSuccess message } }",
    "variables": {
      "companies": [1],
      "sites": [1]
    }
  }'
```

### Query: Get Sites Filter
```bash
curl -X POST http://localhost:5004/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query GetOverviewFilterSites($companies: [Int!], $services: [Int!]) { certificationSitesFilter(companies: $companies, services: $services) { data { id label children { id label children { id label } } } isSuccess message } }",
    "variables": {
      "companies": [1],
      "services": [1]
    }
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "getWidgetforFinancials": {
      "isSuccess": true,
      "message": null,
      "errorCode": null,
      "data": [
        {
          "financialStatus": "Paid",
          "financialCount": 45,
          "financialpercentage": 75.0
        },
        {
          "financialStatus": "Pending",
          "financialCount": 15,
          "financialpercentage": 25.0
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
      "message": "Failed to load overview data",
      "extensions": {
        "code": "INTERNAL_ERROR"
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
- Use `http://localhost:5004` for local development (contact GraphQL host)
- All overview services use the `contact` Apollo client, mapped to `contactGraphqlHost` in the environment
- The overview module is read-only (no mutations) — it aggregates data from certifications, financials, audits, and training
- Site filters support a 3-level tree structure (region → country → site)
- The `overviewCompanyServiceSiteFilter` query returns the full mapping used by the client to build cascading filter dropdowns
