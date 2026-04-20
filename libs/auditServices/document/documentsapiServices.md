# Documents API Services Documentation

## Service Overview

**Service Name:** documentsapiServices  
**Description:** Manages document upload, download, and deletion for audits, findings, certificates, and contracts  
**Base URL:** http://localhost:3000/docs-api  
**Port:** 3000 (via `environment.api` + `environment.documentsApi`)  
**Transport:** REST (HttpClient) — this module does **not** use GraphQL

---

## REST Endpoints

### 1. Download Document
- **Method:** GET
- **Path:** `/download`
- **Description:** Download a single document by ID
- **Authentication:** Bearer Token
- **Query Parameters:**
  | Name | Type | Description |
  |------|------|-------------|
  | documentId | string | Document ID to download |
- **Response:** File binary (blob)

### 2. Delete Document
- **Method:** DELETE
- **Path:** `/DeleteDocument`
- **Description:** Delete a document by ID, scoped to a service entity
- **Authentication:** Bearer Token
- **Query Parameters:**
  | Name | Type | Description |
  |------|------|-------------|
  | {serviceName} | int | Entity ID (e.g., `AuditId=1` or `FindingId=5`) |
  | documentId | string | Document ID to delete |
- **Response:** Success/error status

### 3. Upload Document
- **Method:** POST
- **Path:** Varies by context (passed as URL parameter)
- **Description:** Upload document(s) as multipart form data
- **Authentication:** Bearer Token
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  | Name | Type | Description |
  |------|------|-------------|
  | file | File | The file to upload |
  | AuditId | int | Associated audit ID |
  | FindingId | int? | Associated finding ID (optional) |
- **Response:** Upload result

### 4. Bulk Download Documents
- **Method:** POST
- **Path:** `/Bulkdownload`
- **Description:** Download multiple documents as a ZIP archive
- **Authentication:** Bearer Token
- **Query Parameters:**
  | Name | Type | Description |
  |------|------|-------------|
  | DocType | string | Document type filter |
- **Request Body:** Array of document IDs `[string]`
- **Response:** ZIP file binary (blob)

### 5. Get Contract List
- **Method:** GET
- **Path:** `/ContractList`
- **Description:** Get the full list of contracts (used by contracts module)
- **Authentication:** Bearer Token
- **Response:** `ContractsListDto`

### 6. Export Contracts to Excel
- **Method:** POST
- **Path:** `/ExportContract`
- **Description:** Export filtered contracts data to Excel
- **Authentication:** Bearer Token
- **Request Body:** Contract filter criteria
- **Response:** `number[]` (byte array for Excel file)

---

## cURL Examples

### Download a Single Document
```bash
curl -X GET "http://localhost:3000/docs-api/download?documentId=DOC-001" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -o document.pdf
```

### Delete a Document (Audit scope)
```bash
curl -X DELETE "http://localhost:3000/docs-api/DeleteDocument?AuditId=1&documentId=DOC-001" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Delete a Document (Finding scope)
```bash
curl -X DELETE "http://localhost:3000/docs-api/DeleteDocument?FindingId=5&documentId=DOC-002" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Upload a Document
```bash
curl -X POST "http://localhost:3000/docs-api/upload" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "AuditId=1" \
  -F "FindingId=5"
```

### Bulk Download Documents (ZIP)
```bash
curl -X POST "http://localhost:3000/docs-api/Bulkdownload?DocType=AuditReport" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '["DOC-001", "DOC-002", "DOC-003"]' \
  -o documents.zip
```

### Get Contract List
```bash
curl -X GET "http://localhost:3000/docs-api/ContractList" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Export Contracts to Excel
```bash
curl -X POST "http://localhost:3000/docs-api/ExportContract" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "companies": [1, 2],
    "services": [1],
    "sites": [1]
  }' \
  -o contracts.xlsx
```

---

## Document Download Queue

The documents module includes a client-side **download queue manager** (`DocumentQueueService`) that:

- Queues multiple download requests
- Processes up to **5 concurrent downloads** at a time
- Tracks download progress with statuses: `pending` → `downloading` → `completed` / `failed`
- Exposes a `downloadTasks$` observable for UI binding
- Automatically triggers browser file save on completion

---

## Response Format

### Success Response (Contract List)
```json
{
  "isSuccess": true,
  "data": [
    {
      "contractId": 1,
      "contractName": "Audit Services Contract 2024",
      "status": "Active",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  ],
  "message": null
}
```

### Error Response
```json
{
  "isSuccess": false,
  "data": null,
  "message": "Document not found"
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
- The base URL is composed from `environment.api` (`http://localhost:3000/`) + the relative path `environment.documentsApi` (`/docs-api`)
- This is the only service module that uses **REST/HTTP** instead of GraphQL
- Binary responses (file downloads) should be handled with `responseType: 'blob'`
- The `SKIP_LOADING` header can be set to `'true'` to bypass the global spinner for export operations
- Upload requests use `multipart/form-data` content type (not JSON)
- The contracts module also uses this REST API for its contract list and Excel export functionality
