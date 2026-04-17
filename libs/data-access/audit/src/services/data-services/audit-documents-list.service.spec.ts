import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { environment } from '@customer-portal/environments';

import { AuditDocumentsListDto } from '../../dtos';
import { AuditDocumentsListService } from './audit-documents-list.service';

describe('AuditDocumentsListService', () => {
  let service: AuditDocumentsListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuditDocumentsListService,
      ],
    });
    service = TestBed.inject(AuditDocumentsListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should execute GET when calling service method getAuditDocumentsList', () => {
    // Arrange
    const auditId = '2';
    const planAndReport = false;
    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}/AuditDocumentList?auditId=${auditId}&planAndReport=${planAndReport}`;

    // Act
    service.getAuditDocumentsList(auditId, planAndReport).subscribe();

    // Assert
    const request = httpMock.expectOne(expectedUrl);
    expect(request.request.method).toBe('GET');
    request.flush({} as AuditDocumentsListDto);
  });

  test('should receive expected data when calling service method getAuditDocumentsList with planAndReport set to false', () => {
    // Arrange
    const auditId = '2';
    const planAndReport = false;
    const expectedData: AuditDocumentsListDto = {
      data: [
        {
          documentId: 1234,
          fileName: 'file1.docx',
          type: 'Others',
          dateAdded: '2024-07-05T14:03:05',
          uploadedBy: 'user1',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 2345,
          fileName: 'file2.docx',
          type: 'Others',
          dateAdded: '2024-07-05T08:55:40',
          uploadedBy: 'user2',
          canBeDeleted: true,
          currentSecurity: '10',
        },
      ],
      isSuccess: true,
      message: '',
    };
    jest
      .spyOn(service, 'getAuditDocumentsList')
      .mockReturnValue(of(expectedData));

    // Act
    service
      .getAuditDocumentsList(auditId, planAndReport)
      .subscribe((result) => {
        // Assert
        expect(result).toBe(expectedData);
      });
  });

  test('should receive expected data when calling service method getAuditDocumentsList with planAndReport set to true', () => {
    // Arrange
    const auditId = '2';
    const planAndReport = true;
    const expectedData: AuditDocumentsListDto = {
      data: [
        {
          documentId: 1234,
          fileName: 'file1.docx',
          type: 'Audit Plan',
          dateAdded: '2024-07-05T14:03:05',
          uploadedBy: 'user1',
          canBeDeleted: true,
          currentSecurity: '10',
        },
        {
          documentId: 2345,
          fileName: 'file2.docx',
          type: 'Audit Report',
          dateAdded: '2024-07-05T08:55:40',
          uploadedBy: 'user2',
          canBeDeleted: true,
          currentSecurity: '10',
        },
      ],
      isSuccess: true,
      message: '',
    };
    jest
      .spyOn(service, 'getAuditDocumentsList')
      .mockReturnValue(of(expectedData));

    // Act
    service
      .getAuditDocumentsList(auditId, planAndReport)
      .subscribe((result) => {
        // Assert
        expect(result).toBe(expectedData);
      });
  });
});
