# Certificate API Services Documentation

## Service Overview

**Service Name:** certificateapiServices  
**Description:** Manages audit certificates and certifications  
**Base URL:** http://localhost:5003  
**Port:** 5003  
**Apollo Client:** `certificate` → `certificateGraphqlHost`

---

## REST Endpoints

### 1. Get Minimal Certificate Data
- **Method:** GET
- **Path:** `/api/certificates/minimal`
- **Description:** Get minimal certificate data
- **Authentication:** Bearer Token
- **Response:** List of certificates with minimal information

### 2. Get Minimal Certificate Data by ID
- **Method:** GET
- **Path:** `/api/certificates/minimal/{id}`
- **Description:** Get minimal certificate data by ID
- **Authentication:** Bearer Token
- **Response:** Certificate object with minimal information

### 3. GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## REST Examples

### Get All Certificates (Minimal Data)
```bash
curl -X GET http://localhost:5003/api/certificates/minimal \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Get Certificate by ID (Minimal Data)
```bash
curl -X GET http://localhost:5003/api/certificates/minimal/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

## GraphQL Queries

### 1. certificates
Get list of certificates

**Query:**
```graphql
query {
  certificates {
    data {
      id
      certificateName
      expiryDate
      status
    }
  }
}
```

**Return Type:** `ApiResponse<List<CertificateListResponse>>`

---

### 2. viewCertificateDetails
Get certificate details

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| certificateId | int | Certificate ID |

**Query:**
```graphql
query {
  viewCertificateDetails(certificateId: 1) {
    data {
      id
      certificateName
      certificateType
      issueDate
      expiryDate
      status
      scope
    }
  }
}
```

**Return Type:** `ApiResponse<CertificateDetailResponse>`

---

### 3. sitesInScope
Get sites in scope for certificate

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| certificateId | int | Certificate ID |

**Query:**
```graphql
query {
  sitesInScope(certificateId: 1) {
    data {
      id
      siteName
      location
      scope
    }
  }
}
```

**Return Type:** `ApiResponse<List<CertificateSiteResponse>>`

---

### 4. preferences
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
    objectType: "Certificate"
    objectName: "CertificateList"
    pageName: "Certificates"
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

### 1. createCertificate
Create a new certificate

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateCertificateDto | Certificate creation data |

**Mutation:**
```graphql
mutation {
  createCertificate(input: {
    certificateName: "ISO 9001:2015"
    certificateType: "ISO"
    issueDate: "2024-01-01"
    expiryDate: "2027-01-01"
    scope: "Quality Management"
  }) {
    id
    certificateName
    status
  }
}
```

**Return Type:** `CertificateDto`

---

### 2. updateCertificate
Update certificate

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateCertificateDto | Certificate update data |

**Mutation:**
```graphql
mutation {
  updateCertificate(input: {
    id: 1
    certificateName: "ISO 9001:2015 - Updated"
    certificateType: "ISO"
    expiryDate: "2027-01-01"
    scope: "Quality Management and Operations"
  }) {
    id
    certificateName
    status
  }
}
```

**Return Type:** `CertificateDto`

---

### 3. deleteCertificate
Delete certificate

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| id | int | Certificate ID to delete |

**Mutation:**
```graphql
mutation {
  deleteCertificate(id: 1)
}
```

**Return Type:** `bool`

---

## cURL Examples

### Query: Get All Certificates
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { certificates { data { id certificateName expiryDate status } } }"
  }'
```

### Query: Get Certificate Details
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { viewCertificateDetails(certificateId: 1) { data { id certificateName issueDate expiryDate status } } }"
  }'
```

### Query: Get Sites in Scope
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { sitesInScope(certificateId: 1) { data { id siteName location } } }"
  }'
```

### Mutation: Create Certificate
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createCertificate(input: { certificateName: \"ISO 9001:2015\", certificateType: \"ISO\", issueDate: \"2024-01-01\", expiryDate: \"2027-01-01\" }) { id certificateName status } }"
  }'
```

### Mutation: Update Certificate
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateCertificate(input: { id: 1, certificateName: \"ISO 9001:2015 - Updated\" }) { id certificateName status } }"
  }'
```

### Mutation: Delete Certificate
```bash
curl -X POST http://localhost:5003/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deleteCertificate(id: 1) }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "certificates": {
      "data": [
        {
          "id": 1,
          "certificateName": "ISO 9001:2015",
          "expiryDate": "2027-01-01",
          "status": "Active"
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
      "message": "Certificate not found",
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
- REST endpoints return minimal certificate data; use GraphQL for detailed information
- Certificate status values: "Active", "Expired", "Suspended", "Revoked"
