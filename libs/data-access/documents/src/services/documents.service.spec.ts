import { HttpParams, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@customer-portal/environments';

import { DocType } from '../models';
import { DocumentsService } from './documents.service';

const mockBlob = new Blob(['mock content'], { type: 'application/pdf' });

describe('DocumentsService', () => {
  let service: DocumentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DocumentsService,
      ],
    });

    service = TestBed.inject(DocumentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  test('should download a document', () => {
    // Arrange
    const documentId = 1;
    const fileName = 'example.pdf';
    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}/download?documentId=${documentId}`;

    // Act
    service.downloadDocument(documentId, fileName).subscribe((response) => {
      // Assert
      expect(response.body).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Accept')).toBe(true);
    expect(req.request.headers.get('Accept')).toBe('application/pdf');
    req.flush(mockBlob, { status: 200, statusText: 'OK' });
  });

  test('should delete a document', () => {
    // Arrange
    const serviceName = 'randomServiceName';
    const serviceId = '1';
    const documentId = 1;
    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}/DeleteDocument?${serviceName}=${serviceId}&documentId=${documentId}`;

    const mockResponse = { success: true };

    // Act
    service
      .deleteDocument(serviceName, serviceId, documentId)
      .subscribe((response) => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  test('should upload a document with auditId only', () => {
    // Arrange
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });
    const url = '/upload';
    const auditId = 'audit123';
    const formData = new FormData();
    formData.append('files', file, file.name);

    const expectedParams = new HttpParams().set('AuditId', auditId);

    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}${url}`;

    const mockResponse = [{ fileName: 'file.txt', success: true }];

    // Act
    service.uploadDocument(url, file, auditId).subscribe((response) => {
      // Assert
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === expectedUrl &&
        request.params.toString() === expectedParams.toString() &&
        request.headers.has('SKIP_LOADING'),
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  test('should upload a document with auditId and findingId', () => {
    // Arrange
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });
    const url = '/upload';
    const auditId = 'audit123';
    const findingId = 'finding456';
    const formData = new FormData();
    formData.append('files', file, file.name);

    const expectedParams = new HttpParams()
      .set('AuditId', auditId)
      .set('FindingId', findingId);

    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}${url}`;
    const mockResponse = [{ fileName: 'file.txt', success: true }];

    // Act
    service
      .uploadDocument(url, file, auditId, findingId)
      .subscribe((response) => {
        // Assert
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      (request) =>
        request.url === expectedUrl &&
        request.params.toString() === expectedParams.toString() &&
        request.headers.has('SKIP_LOADING'),
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  test('should download all documents', () => {
    // Arrange
    const documentIds = [1, 2, 3];
    const docType = DocType.Audit;

    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}/Bulkdownload?DocType=${docType}`;

    // Act
    service.downloadAllDocuments(documentIds, docType).subscribe((response) => {
      // Assert
      expect(response.body).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(documentIds);
    req.flush(mockBlob, { status: 200, statusText: 'OK' });
  });
});
