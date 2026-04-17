import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';

import { environment } from '@customer-portal/environments';
import {
  createMessageServiceMock,
  getTranslocoModule,
} from '@customer-portal/shared';

import { AuditFileUploadService } from './audit-file-upload.service';

describe('AuditFileUploadService', () => {
  let service: AuditFileUploadService;
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });
    service = TestBed.inject(AuditFileUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('sendFile should upload document and show success toast on success', () => {
    // Arrange
    const mockFile = new File([''], 'test.pdf');
    const mockResponse = { status: 'success' };
    const formData = new FormData();
    formData.append('file', mockFile);
    const auditId = 2;
    const { documentsApi } = environment;

    // Act
    service.sendFile(mockFile, auditId).subscribe((response) => {
      // Assert
      expect(response).toEqual(mockResponse);
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' }),
      );
    });

    const req = httpMock.expectOne(
      `${documentsApi}/AuditDocumentUpload?AuditId=${auditId}`,
    );
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  test('sendFile should handle error correctly', () => {
    // Arrange
    const mockFile = new File([''], 'test.pdf');
    const mockError = new Error('An error occurred');
    const auditId = 2;

    jest
      .spyOn(service, 'sendFile')
      .mockReturnValue(throwError(() => mockError));

    // Act
    service.sendFile(mockFile, auditId).subscribe({
      error: (error) => {
        // Assert
        expect(error).toBe(mockError);
      },
    });

    // Assert
    expect(service.sendFile).toHaveBeenCalled();
  });
});
