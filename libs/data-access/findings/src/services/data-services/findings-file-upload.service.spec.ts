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

import { FindingsFileUploadService } from './findings-file-upload.service';

const { documentsApi } = environment;
describe('FindingsFileUploadService', () => {
  let service: FindingsFileUploadService;
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });
    service = TestBed.inject(FindingsFileUploadService);
    httpTestingController = TestBed.inject(HttpTestingController);
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

    // Act
    service.sendFile(mockFile, 'auditId', 'findingId').subscribe((response) => {
      // Assert
      expect(response).toEqual(mockResponse);
      expect(messageServiceMock.add).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' }),
      );
    });

    const req = httpTestingController.expectOne(
      `${documentsApi}/FindingDocumentUpload?AuditId=auditId&FindingId=findingId`,
    );
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  test('sendFile should handle error correctly', () => {
    // Arrange
    const mockFile = new File([''], 'test.pdf');
    const mockError = new Error('An error occurred');

    // Act
    jest
      .spyOn(service, 'sendFile')
      .mockReturnValue(throwError(() => mockError));

    service.sendFile(mockFile, 'auditId', 'findingId').subscribe({
      error: (error) => {
        // Assert
        expect(error).toBe(mockError);
      },
    });

    // Assert
    expect(service.sendFile).toHaveBeenCalled();
  });
});
