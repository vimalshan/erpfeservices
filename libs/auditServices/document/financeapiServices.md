# Finance API Services Documentation

## Service Overview

**Service Name:** financeapiServices  
**Description:** Manages financial operations and invoice tracking  
**Base URL:** http://localhost:5005  
**Port:** 5005  
**Apollo Client:** `invoice` → `invoicesGraphqlHost`

---

## REST Endpoints

### GraphQL Endpoint
- **Method:** POST
- **Path:** `/graphql`
- **Description:** GraphQL endpoint for queries and mutations
- **Authentication:** Bearer Token

---

## GraphQL Queries

### 1. InvoiceListPage
Get invoice list page

**Parameters:**
| Name | Type | Description | Default |
|------|------|-------------|---------|
| pageNumber | int | Page number | 1 |
| pageSize | int | Page size | 10 |
| status | string? | Invoice status filter | null |
| companyFilter | string? | Company filter | null |
| startDate | DateTime? | Start date filter | null |
| endDate | DateTime? | End date filter | null |

**Query:**
```graphql
query {
  InvoiceListPage(
    pageNumber: 1
    pageSize: 10
    status: "Pending"
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  ) {
    data {
      id
      invoiceNumber
      amount
      dueDate
      status
    }
    pageInfo {
      pageNumber
      pageSize
      totalCount
    }
  }
}
```

**Return Type:** `ApiResponse<InvoiceListPageData>`

---

### 2. DownloadInvoice
Download invoice

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| invoiceNumber | List<string> | Invoice numbers to download |
| userId | int? | User ID (optional) |

**Query:**
```graphql
query {
  DownloadInvoice(
    invoiceNumber: ["INV001", "INV002"]
    userId: 123
  ) {
    data {
      downloadUrl
      fileName
      invoiceNumber
    }
  }
}
```

**Return Type:** `ApiResponse<DownloadInvoiceResponse>`

---

## GraphQL Mutations

### 1. UpdatePlannedPaymentDate
Update planned payment date

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| invoiceNumber | List<string> | Invoice numbers |
| plannedDates | DateTime | Planned payment date |

**Mutation:**
```graphql
mutation {
  UpdatePlannedPaymentDate(
    invoiceNumber: ["INV001", "INV002"]
    plannedDates: "2024-06-01"
  ) {
    data
  }
}
```

**Return Type:** `ApiResponse<bool>`

---

### 2. createInvoice
Create a new invoice

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateInvoiceDto | Invoice creation data |

**Mutation:**
```graphql
mutation {
  createInvoice(input: {
    invoiceNumber: "INV-2024-001"
    companyId: 1
    amount: 5000.00
    invoiceDate: "2024-01-01"
    dueDate: "2024-02-01"
    description: "Audit Services"
  }) {
    id
    invoiceNumber
    amount
    status
  }
}
```

**Return Type:** `InvoiceDto`

---

### 3. updateInvoice
Update invoice

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | UpdateInvoiceDto | Invoice update data |

**Mutation:**
```graphql
mutation {
  updateInvoice(input: {
    id: 1
    amount: 5500.00
    dueDate: "2024-02-15"
    description: "Audit Services - Updated"
  }) {
    id
    invoiceNumber
    amount
    status
  }
}
```

**Return Type:** `InvoiceDto`

---

### 4. deleteInvoice
Delete invoice

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| invoiceId | int | Invoice ID to delete |

**Mutation:**
```graphql
mutation {
  deleteInvoice(invoiceId: 1)
}
```

**Return Type:** `bool`

---

### 5. markInvoicePaid
Mark invoice as paid

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| invoiceId | int | Invoice ID |
| paidDate | DateTime | Payment date |
| paymentMethod | string? | Payment method |
| paymentReference | string? | Payment reference |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  markInvoicePaid(
    invoiceId: 1
    paidDate: "2024-02-01"
    paymentMethod: "Bank Transfer"
    paymentReference: "REF123456"
    modifiedBy: 123
  ) {
    id
    invoiceNumber
    amount
    status
    paidDate
  }
}
```

**Return Type:** `InvoiceDto`

---

### 6. changeInvoiceStatus
Change invoice status

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| invoiceId | int | Invoice ID |
| newStatus | string | New status (e.g., "Pending", "Paid", "Overdue") |
| modifiedBy | int? | User ID who made the change |

**Mutation:**
```graphql
mutation {
  changeInvoiceStatus(
    invoiceId: 1
    newStatus: "Paid"
    modifiedBy: 123
  ) {
    id
    invoiceNumber
    status
  }
}
```

**Return Type:** `InvoiceDto`

---

### 7. createFinancial
Create a financial record

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| input | CreateFinancialDto | Financial creation data |

**Mutation:**
```graphql
mutation {
  createFinancial(input: {
    description: "Q1 Financial Record"
    amount: 25000.00
    type: "Revenue"
    date: "2024-03-31"
  }) {
    id
    description
    amount
    type
  }
}
```

**Return Type:** `FinancialDto`

---

## cURL Examples

### Query: Get Invoice List
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { InvoiceListPage(pageNumber: 1, pageSize: 10) { data { id invoiceNumber amount status } pageInfo { totalCount } } }"
  }'
```

### Query: Get Invoice List with Filters
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { InvoiceListPage(pageNumber: 1, pageSize: 10, status: \"Pending\", startDate: \"2024-01-01\", endDate: \"2024-12-31\") { data { id invoiceNumber amount dueDate status } } }"
  }'
```

### Query: Download Invoice
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "query { DownloadInvoice(invoiceNumber: [\"INV001\", \"INV002\"]) { data { downloadUrl fileName } } }"
  }'
```

### Mutation: Create Invoice
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { createInvoice(input: { invoiceNumber: \"INV-2024-001\", companyId: 1, amount: 5000, invoiceDate: \"2024-01-01\", dueDate: \"2024-02-01\" }) { id invoiceNumber amount status } }"
  }'
```

### Mutation: Update Invoice
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { updateInvoice(input: { id: 1, amount: 5500, dueDate: \"2024-02-15\" }) { id invoiceNumber amount status } }"
  }'
```

### Mutation: Mark Invoice as Paid
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { markInvoicePaid(invoiceId: 1, paidDate: \"2024-02-01\", paymentMethod: \"Bank Transfer\", paymentReference: \"REF123456\", modifiedBy: 123) { id invoiceNumber status } }"
  }'
```

### Mutation: Change Invoice Status
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { changeInvoiceStatus(invoiceId: 1, newStatus: \"Paid\", modifiedBy: 123) { id invoiceNumber status } }"
  }'
```

### Mutation: Delete Invoice
```bash
curl -X POST http://localhost:5005/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "query": "mutation { deleteInvoice(invoiceId: 1) }"
  }'
```

---

## Response Format

### Success Response
```json
{
  "data": {
    "InvoiceListPage": {
      "data": [
        {
          "id": 1,
          "invoiceNumber": "INV-2024-001",
          "amount": 5000.00,
          "dueDate": "2024-02-01",
          "status": "Pending"
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
      "message": "Invoice not found",
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
- Use `http://localhost:5005` for local development
- All timestamps are in ISO 8601 format
- Invoice status values: "Draft", "Pending", "Paid", "Overdue", "Cancelled"
- Payment methods: "Bank Transfer", "Credit Card", "Check", "Cash"
