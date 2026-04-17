import { signal } from '@angular/core';

import { SpinnerService } from '@customer-portal/core';
import {
  AuditDetailsStoreService,
  createAuditDetailsStoreServiceMock,
} from '@customer-portal/data-access/audit';
import {
  createDocumentStoreServiceMock,
  DocType,
  DocumentsStoreService,
} from '@customer-portal/data-access/documents';

import { AuditDetailsComponent } from './audit-details.component';

describe('AuditDetailsComponent', () => {
  let component: AuditDetailsComponent;
  const auditDetailsStoreServiceMock: Partial<AuditDetailsStoreService> =
    createAuditDetailsStoreServiceMock();
  const documentsStoreServiceMock: Partial<DocumentsStoreService> =
    createDocumentStoreServiceMock();
  const spinnerServiceMock: Partial<SpinnerService> = {
    setLoading: jest.fn(),
  };

  beforeEach(async () => {
    component = new AuditDetailsComponent(
      auditDetailsStoreServiceMock as AuditDetailsStoreService,
      documentsStoreServiceMock as DocumentsStoreService,
      spinnerServiceMock as SpinnerService,
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should load audit details when component is initialized', () => {
    // Assert
    expect(auditDetailsStoreServiceMock.loadAuditDetails).toHaveBeenCalled();
  });

  test('should reset audit details state state on destroy', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      auditDetailsStoreServiceMock.resetAuditDetailsState,
    ).toHaveBeenCalled();
  });

  test('should get auditId', () => {
    // Arrange
    auditDetailsStoreServiceMock.auditId = signal('1');
    const spy = jest.spyOn(auditDetailsStoreServiceMock, 'auditId');

    // Act
    const result = component.auditId;

    // Assert
    expect(result).toBe('1');
    expect(spy).toHaveBeenCalled();
  });

  test('should not trigger download when documentId is not provided', () => {
    // Act
    component.handleDownload(undefined);

    // Assert
    expect(documentsStoreServiceMock.downloadDocument).not.toHaveBeenCalled();
  });

  test('should trigger download when documentId is provided', () => {
    // Act
    component.handleDownload([1]);

    // Assert
    expect(documentsStoreServiceMock.downloadAllDocuments).toHaveBeenCalledWith(
      [1],
      DocType.Audit,
    );
  });

  // TODO - add assertion after BE endpoint is available
  // test('should trigger download', () => {
  //   component.handleDownload('http://example.com/file-url', false);
  //   expect(auditDownloadServiceMock.getDocumentAuthToken).toHaveBeenCalled();
  // });
});
