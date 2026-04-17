import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@customer-portal/environments';

import { FindingDocumentsListDto } from '../../dtos';
import { FindingDocumentsListService } from './finding-documents-list.service';

describe('FindingDocumentsListService', () => {
  let service: FindingDocumentsListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FindingDocumentsListService,
      ],
    });
    service = TestBed.inject(FindingDocumentsListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should call the correct URL with parameters', () => {
    // Arrange
    const findingsId = '456';
    const auditId = '789';
    const { documentsApi } = environment;
    const expectedUrl = `${documentsApi}/FindingsDocumentList?auditId=${auditId}&findingsId=${findingsId}`;

    // Act
    service.getFindingDocumentsList(auditId, findingsId).subscribe();

    // Assert
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({} as FindingDocumentsListDto);
  });
});
